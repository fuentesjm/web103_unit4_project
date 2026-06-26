import React from 'react'
import { findOption } from '../utilities/partTypes'
import '../css/RigPreview.css'

// Style change: the selected Case drives the tower's size/shape.
const caseShape = (name = '') => {
    if (name.includes('Mini')) return { height: 90, width: 130, label: 'Mini-ITX Cube' }
    if (name.includes('Mid')) return { height: 180, width: 115, label: 'Mid Tower' }
    if (name.includes('Full')) return { height: 240, width: 125, label: 'Full Tower' }
    return { height: 150, width: 115, label: 'No case selected' }
}

// Color change: the selected GPU's brand drives the accent color.
const gpuAccent = (name = '') => {
    if (name.includes('NVIDIA')) return '#76b900' // NVIDIA green
    if (name.includes('AMD')) return '#ed1c24'     // AMD red
    return '#555'
}

const RigPreview = ({ selected, options }) => {
    const pcCase = findOption(options, selected.pc_case)
    const gpu = findOption(options, selected.gpu)

    const shape = caseShape(pcCase?.name)
    const accent = gpuAccent(gpu?.name)

    return (
        <div className='rig-preview'>
            <div
                className='rig-tower'
                style={{ height: shape.height, width: shape.width, borderColor: accent }}
            >
                {/* glowing strip = the GPU, colored by brand */}
                <div
                    className='rig-gpu'
                    style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
                />
                <div className='rig-vent' />
                <div className='rig-vent' />
            </div>
            <p className='rig-caption'>{shape.label}</p>
        </div>
    )
}

export default RigPreview
