import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOptions, getPC, updatePC } from '../services/PCsAPI'
import RigPreview from '../components/RigPreview'
import { PART_TYPES, groupByType } from '../utilities/partTypes'
import { calcTotalPrice } from '../utilities/calcPrice'
import { getConflicts } from '../utilities/validation'
import '../App.css'

const EditPC = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const [build, setBuild] = useState(null)

    // Load the catalog AND the existing build, then pre-fill the form.
    useEffect(() => {
        document.title = title
        const fetchData = async () => {
            const [opts, pc] = await Promise.all([getOptions(), getPC(id)])
            setOptions(opts)
            setBuild({
                name: pc.name || '',
                cpu: pc.cpu ?? '',
                gpu: pc.gpu ?? '',
                ram: pc.ram ?? '',
                storage: pc.storage ?? '',
                pc_case: pc.pc_case ?? '',
            })
        }
        fetchData()
    }, [id, title])

    const handleChange = (e) => {
        setBuild({ ...build, [e.target.name]: e.target.value })
    }

    if (!build) return <p>Loading…</p>

    const grouped = groupByType(options)
    const total = calcTotalPrice(build, options)
    const conflicts = getConflicts(build, options)

    const allPartsChosen = PART_TYPES.every(({ key }) => build[key] !== '')
    const canSave = build.name.trim() !== '' && allPartsChosen && conflicts.length === 0

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!canSave) return
        await updatePC(id, build)
        navigate(`/pcs/${id}`)
    }

    return (
        <div className='edit-pc'>
            <h2>Edit Build</h2>

            <RigPreview selected={build} options={options} />

            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>Build name</label>
                <input
                    id='name'
                    name='name'
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
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default EditPC
