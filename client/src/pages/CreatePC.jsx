import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOptions, createPC } from '../services/PCsAPI'
import RigPreview from '../components/RigPreview'
import { PART_TYPES, groupByType } from '../utilities/partTypes'
import { calcTotalPrice } from '../utilities/calcPrice'
import { getConflicts } from '../utilities/validation'
import '../App.css'

const CreatePC = ({ title }) => {
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const [build, setBuild] = useState({
        name: '',
        cpu: '',
        gpu: '',
        ram: '',
        storage: '',
        pc_case: '',
    })

    useEffect(() => {
        document.title = title
        const fetchOptions = async () => {
            const data = await getOptions()
            setOptions(data)
        }
        fetchOptions()
    }, [title])

    // Update one field of the build whenever a select / input changes.
    const handleChange = (e) => {
        setBuild({ ...build, [e.target.name]: e.target.value })
    }

    // Recompute these on every render so price + warnings stay live.
    const grouped = groupByType(options)
    const total = calcTotalPrice(build, options)
    const conflicts = getConflicts(build, options)

    const allPartsChosen = PART_TYPES.every(({ key }) => build[key] !== '')
    const canSave = build.name.trim() !== '' && allPartsChosen && conflicts.length === 0

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!canSave) return
        const created = await createPC(build)
        navigate(`/pcs/${created.id}`)
    }

    return (
        <div className='create-pc'>
            <h2>Customize Your Rig</h2>

            <RigPreview selected={build} options={options} />

            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>Build name</label>
                <input
                    id='name'
                    name='name'
                    placeholder='e.g. Streaming Beast'
                    value={build.name}
                    onChange={handleChange}
                />

                {PART_TYPES.map(({ key, label }) => (
                    <div key={key}>
                        <label htmlFor={key}>{label}</label>
                        <select id={key} name={key} value={build[key]} onChange={handleChange}>
                            <option value=''>-- choose {label} --</option>
                            {grouped[key].map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.name} (+${Number(opt.price).toLocaleString()})
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {conflicts.length > 0 && (
                    <ul className='conflicts'>
                        {conflicts.map((msg, i) => (
                            <li key={i}>⚠️ {msg}</li>
                        ))}
                    </ul>
                )}

                <h3 className='total'>Total: ${total.toLocaleString()}</h3>

                <button type='submit' disabled={!canSave}>
                    Save Build
                </button>
            </form>
        </div>
    )
}

export default CreatePC
