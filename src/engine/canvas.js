export class Canvas {
    constructor(container, nodeRenderer = null) {
        this.container = container
        this.svg = this.createSVG()
        this.viewport = { x: 0, y: 0, zoom: 1 }
        this.nodes = new Map()
        this.edges = new Map()

        // Параметры сетки
        this.gridSize = 20
        this.gridColor = '#9ec8ff50'
        this.dotRadius = 1.5

        this.isPanning = false
        this.isConnecting = false
        this.tempEdge = null
        this.connectFrom = null
        this.lastMouse = { x: 0, y: 0 }

        this.typeColors = {
            string: '#48BB78',
            number: '#4299E1',
            boolean: '#ED64A6',
            object: '#F6AD55',
            array: '#A0AEC0',
            any: '#CBD5E0'
        }
        this.portSize = 8

        this.nodeRenderer = nodeRenderer

        this.initLayers()
        this.bindEvents()
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('class', 'w-full h-full bg-gray-900')
        this.container.appendChild(svg)
        return svg
    }

    initLayers() {
        this.defs = this.createDefs()
        this.gridLayer = this.createLayer('grid-layer')
        this.edgesLayer = this.createLayer('edges-layer')
        this.nodesLayer = this.createLayer('nodes-layer')

        this.svg.appendChild(this.defs)
        this.drawGrid()
    }

    createDefs() {
        return document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    }

    createLayer(className) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('class', className)
        this.svg.appendChild(g)
        return g
    }

    drawGrid() {
        this.gridLayer.innerHTML = ''

        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
        pattern.setAttribute('id', 'dot-grid')
        pattern.setAttribute('width', this.gridSize)
        pattern.setAttribute('height', this.gridSize)
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        dot.setAttribute('cx', this.gridSize / 2)
        dot.setAttribute('cy', this.gridSize / 2)
        dot.setAttribute('r', this.dotRadius)
        dot.setAttribute('fill', this.gridColor)

        pattern.appendChild(dot)
        this.defs.appendChild(pattern)

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', 'url(#dot-grid)')

        this.gridLayer.appendChild(rect)
        this.gridRect = rect
    }

    snapToGrid(value) {
        return Math.round(value / this.gridSize) * this.gridSize
    }

    bindEvents() {
        this.svg.addEventListener('mousedown', (e) => {
            const port = e.target.closest('.port')
            if (port) {
                const portGroup = port.parentElement
                const direction = portGroup.dataset.direction
                if (direction === 'output') {
                    e.preventDefault()
                    e.stopPropagation()
                    this.isConnecting = true
                    this.connectFrom = { nodeId: portGroup.dataset.nodeId, portName: portGroup.dataset.portName }

                    const fromNode = this.nodes.get(this.connectFrom.nodeId)
                    const fromIndex = fromNode.outputs.findIndex(o => o.name === this.connectFrom.portName)
                    const fromNum = fromNode.outputs.length
                    const fromX = fromNode.x + fromNode.width * (fromIndex + 0.5) / fromNum
                    const fromY = fromNode.y + fromNode.height + this.portSize

                    this.tempEdge = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                    this.tempEdge.setAttribute('d', `M ${fromX} ${fromY} L ${fromX} ${fromY}`)
                    this.tempEdge.setAttribute('stroke', '#A0AEC0')
                    this.tempEdge.setAttribute('stroke-width', '2')
                    this.tempEdge.setAttribute('stroke-dasharray', '5 5')
                    this.edgesLayer.appendChild(this.tempEdge)
                }
                return
            }

            if (e.button === 1 || e.button === 2) {
                e.preventDefault()
                this.isPanning = true
                this.lastMouse = { x: e.clientX, y: e.clientY }
                this.svg.style.cursor = 'grabbing'
            }
        })

        window.addEventListener('mousemove', (e) => {
            if (this.isConnecting) {
                const rect = this.svg.getBoundingClientRect()
                const screenX = e.clientX - rect.left
                const screenY = e.clientY - rect.top
                const world = this.screenToWorld(screenX, screenY)

                const fromNode = this.nodes.get(this.connectFrom.nodeId)
                const fromIndex = fromNode.outputs.findIndex(o => o.name === this.connectFrom.portName)
                const fromNum = fromNode.outputs.length
                const fromX = fromNode.x + fromNode.width * (fromIndex + 0.5) / fromNum
                const fromY = fromNode.y + fromNode.height + this.portSize

                const d = `M ${fromX} ${fromY} L ${world.x} ${world.y}`
                this.tempEdge.setAttribute('d', d)
                return
            }

            if (!this.isPanning) return

            const dx = e.clientX - this.lastMouse.x
            const dy = e.clientY - this.lastMouse.y

            this.viewport.x += dx
            this.viewport.y += dy
            this.lastMouse = { x: e.clientX, y: e.clientY }

            this.updateTransform()
        })

        window.addEventListener('mouseup', (e) => {
            if (this.isConnecting) {
                const port = e.target.closest('.port')
                if (port) {
                    const portGroup = port.parentElement
                    const direction = portGroup.dataset.direction
                    if (direction === 'input') {
                        const toNodeId = portGroup.dataset.nodeId
                        const toPortName = portGroup.dataset.portName
                        if (toNodeId !== this.connectFrom.nodeId) {
                            this.addEdge(this.connectFrom.nodeId, this.connectFrom.portName, toNodeId, toPortName)
                        }
                    }
                }
                if (this.tempEdge) this.edgesLayer.removeChild(this.tempEdge)
                this.isConnecting = false
                this.tempEdge = null
                this.connectFrom = null
                return
            }

            this.isPanning = false
            this.svg.style.cursor = 'default'
        })

        this.svg.addEventListener('wheel', (e) => {
            e.preventDefault()

            const zoomIntensity = 0.1
            const direction = e.deltaY > 0 ? -1 : 1
            const factor = 1 + (zoomIntensity * direction)
            const newZoom = Math.max(0.1, Math.min(5, this.viewport.zoom * factor))

            const rect = this.svg.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            this.viewport.x = mouseX - (mouseX - this.viewport.x) * (newZoom / this.viewport.zoom)
            this.viewport.y = mouseY - (mouseY - this.viewport.y) * (newZoom / this.viewport.zoom)
            this.viewport.zoom = newZoom

            this.updateTransform()
        }, { passive: false })

        this.svg.addEventListener('contextmenu', e => e.preventDefault())
    }

    updateTransform() {
        const transform = `translate(${this.viewport.x}, ${this.viewport.y}) scale(${this.viewport.zoom})`
        this.nodesLayer.setAttribute('transform', transform)
        this.edgesLayer.setAttribute('transform', transform)

        const gridOffsetX = this.viewport.x % this.gridSize
        const gridOffsetY = this.viewport.y % this.gridSize
        this.gridRect.setAttribute('transform', `translate(${gridOffsetX}, ${gridOffsetY})`)
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.viewport.x) / this.viewport.zoom,
            y: (screenY - this.viewport.y) / this.viewport.zoom
        }
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.viewport.zoom + this.viewport.x,
            y: worldY * this.viewport.zoom + this.viewport.y
        }
    }

    registerNode(id, type, x, y, data = {}) {
        const snappedX = this.snapToGrid(x)
        const snappedY = this.snapToGrid(y)

        const node = {
            id,
            type,
            x: snappedX,
            y: snappedY,
            width: data.width || 227,
            height: data.height || 183,
            inputs: data.inputs || [],
            outputs: data.outputs || [],
            data: data.data || {},
            element: null
        }

        this.nodes.set(id, node)
        this.renderNode(node)
        return node
    }

    renderNode(node) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('transform', `translate(${node.x}, ${node.y})`)
        g.setAttribute('class', 'node cursor-move')
        g.dataset.id = node.id

        // Input ports (top)
        node.inputs.forEach((input, i) => {
            const portGroup = this.createPort(input, 'input', node, i)
            g.appendChild(portGroup)
        })

        // Output ports (bottom)
        node.outputs.forEach((output, i) => {
            const portGroup = this.createPort(output, 'output', node, i)
            g.appendChild(portGroup)
        })

        // Node body (foreignObject for HTML/Vue)
        const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        foreign.setAttribute('width', node.width)
        foreign.setAttribute('height', node.height)
        foreign.setAttribute('x', 0)
        foreign.setAttribute('y', 0)

        const div = document.createElement('div')
        div.id = `node-${node.id}`
        div.classList.add('w-full', 'h-full', 'bg-gray-800/50', 'border-2', 'border-blue-300', 'backdrop-blur-md', 'rounded-r-[17px]', 'overflow-hidden')
        foreign.appendChild(div)
        g.appendChild(foreign)

        this.nodesLayer.appendChild(g)
        node.element = g

        // Render Vue component if callback provided
        if (this.nodeRenderer) {
            // Give browser a chance to attach the foreignObject/div to real DOM
            requestAnimationFrame(() => {
                this.nodeRenderer(div, node)
            })
        } else {
            // Placeholder
            div.innerHTML = `<div class="p-4 text-gray-200">
        <h3 class="text-sm font-semibold">${node.type}</h3>
        <p class="text-xs">Custom content here</p>
      </div>`
        }

        // Drag logic
        let isDragging = false
        let dragStart = { x: 0, y: 0 }
        let nodeStart = { x: 0, y: 0 }

        g.addEventListener('mousedown', (e) => {
            if (e.target.closest('.port')) return // Don't drag if on port
            e.stopPropagation()
            isDragging = true
            dragStart = { x: e.clientX, y: e.clientY }
            nodeStart = { x: node.x, y: node.y }
            g.style.cursor = 'grabbing'
            this.bringToFront(node)
        })

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return

            const dx = (e.clientX - dragStart.x) / this.viewport.zoom
            const dy = (e.clientY - dragStart.y) / this.viewport.zoom

            const newX = nodeStart.x + dx
            const newY = nodeStart.y + dy

            node.x = this.snapToGrid(newX)
            node.y = this.snapToGrid(newY)

            g.setAttribute('transform', `translate(${node.x}, ${node.y})`)
            this.updateEdgesForNode(node)
        })

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false
                g.style.cursor = 'move'
            }
        })
    }

    createPort(portData, direction, node, index) {
        const isInput = direction === 'input'
        const numPorts = isInput ? node.inputs.length : node.outputs.length
        const x = node.width * (index + 0.5) / numPorts
        const y = isInput ? -this.portSize : node.height + this.portSize

        const portGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        portGroup.setAttribute('transform', `translate(${x}, ${y})`)
        portGroup.dataset.nodeId = node.id
        portGroup.dataset.portName = portData.name
        portGroup.dataset.direction = direction
        portGroup.setAttribute('class', 'cursor-pointer')

        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        const size = this.portSize
        poly.setAttribute('points', `0,${-size} ${size},0 0,${size} ${-size},0`)
        poly.setAttribute('class', 'port')

        let fill
        if (isInput) {
            const types = portData.types || ['any']
            if (types.length === 1) {
                fill = this.typeColors[types[0]] || this.typeColors.any
            } else {
                const gradId = `grad-${node.id}-${direction}-${index}`
                const linear = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
                linear.setAttribute('id', gradId)
                linear.setAttribute('x1', '0%')
                linear.setAttribute('y1', '0%')
                linear.setAttribute('x2', '100%')
                linear.setAttribute('y2', '0%')
                types.forEach((t, i) => {
                    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
                    stop.setAttribute('offset', `${(i / (types.length - 1)) * 100}%`)
                    stop.setAttribute('stop-color', this.typeColors[t] || this.typeColors.any)
                    linear.appendChild(stop)
                })
                this.defs.appendChild(linear)
                fill = `url(#${gradId})`
            }
        } else {
            fill = this.typeColors[portData.type] || this.typeColors.any
        }
        poly.setAttribute('fill', fill)
        poly.setAttribute('stroke', '#2D3748')
        poly.setAttribute('stroke-width', '1')

        portGroup.appendChild(poly)

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.textContent = portData.name
        text.setAttribute('fill', '#E2E8F0')
        text.setAttribute('font-size', '10')
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('y', isInput ? -size - 6 : size + 14)
        portGroup.appendChild(text)

        return portGroup
    }

    bringToFront(node) {
        if (node.element) {
            this.nodesLayer.appendChild(node.element)
        }
    }

    addEdge(fromNodeId, fromOutputName, toNodeId, toInputName) {
        const id = `${fromNodeId}-${fromOutputName}-${toNodeId}-${toInputName}`
        if (this.edges.has(id)) return

        const fromNode = this.nodes.get(fromNodeId)
        const toNode = this.nodes.get(toNodeId)
        const fromPort = fromNode.outputs.find(o => o.name === fromOutputName)
        const toPort = toNode.inputs.find(i => i.name === toInputName)

        if (!fromPort || !toPort || !toPort.types.includes(fromPort.type)) return // Invalid

        const edge = {
            id,
            fromNodeId,
            fromOutputName,
            toNodeId,
            toInputName,
            element: null
        }

        this.edges.set(id, edge)
        this.renderEdge(edge)
    }

    renderEdge(edge) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke', '#63B3ED')
        path.setAttribute('stroke-width', '2')
        path.setAttribute('marker-end', 'url(#arrow)')

        if (!this.defs.querySelector('#arrow')) {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
            marker.setAttribute('id', 'arrow')
            marker.setAttribute('viewBox', '0 -5 10 10')
            marker.setAttribute('refX', '8')
            marker.setAttribute('markerWidth', '6')
            marker.setAttribute('markerHeight', '6')
            marker.setAttribute('orient', 'auto')
            const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
            poly.setAttribute('points', '0 -5 10 0 0 5')
            poly.setAttribute('fill', '#63B3ED')
            marker.appendChild(poly)
            this.defs.appendChild(marker)
        }

        this.edgesLayer.appendChild(path)
        edge.element = path
        this.updateEdge(edge)
    }

    updateEdge(edge) {
        const fromNode = this.nodes.get(edge.fromNodeId)
        const toNode = this.nodes.get(edge.toNodeId)

        const fromIndex = fromNode.outputs.findIndex(o => o.name === edge.fromOutputName)
        const fromNum = fromNode.outputs.length
        const fromX = fromNode.x + fromNode.width * (fromIndex + 0.5) / fromNum
        const fromY = fromNode.y + fromNode.height + this.portSize

        const toIndex = toNode.inputs.findIndex(i => i.name === edge.toInputName)
        const toNum = toNode.inputs.length
        const toX = toNode.x + toNode.width * (toIndex + 0.5) / toNum
        const toY = toNode.y - this.portSize

        const dx = toX - fromX
        const dy = toY - fromY
        const controlY = fromY + Math.abs(dy) / 2
        const d = `M ${fromX} ${fromY} C ${fromX} ${controlY} ${toX} ${controlY} ${toX} ${toY}`
        edge.element.setAttribute('d', d)
    }

    updateEdgesForNode(node) {
        this.edges.forEach((edge) => {
            if (edge.fromNodeId === node.id || edge.toNodeId === node.id) {
                this.updateEdge(edge)
            }
        })
    }

    getJSON() {
        const nodes = Array.from(this.nodes.values()).map(node => ({
            id: node.id,
            type: node.type,
            x: node.x,
            y: node.y,
            inputs: node.inputs,
            outputs: node.outputs,
            data: node.data
        }))
        const edges = Array.from(this.edges.values()).map(edge => ({
            fromNode: edge.fromNodeId,
            fromPort: edge.fromOutputName,
            toNode: edge.toNodeId,
            toPort: edge.toInputName
        }))
        return { nodes, edges }
    }
}