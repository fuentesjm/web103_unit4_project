import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPC, deletePC } from '../services/PCsAPI'
import { PART_TYPES } from '../utilities/partTypes'
import '../App.css'

const PCDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pc, setPC] = useState(null)

    useEffect(() => {
        document.title = title
        const fetchPC = async () => {
            const data = await getPC(id)
            setPC(data)
        }
        fetchPC()
    }, [id, title])

    const handleDelete = async () => {
        await deletePC(id)
        navigate('/pcs')
    }

    if (!pc) return <p>Loading…</p>
    if (pc.error) return <p>{pc.error}</p>

    return (
        <div className='pc-details'>
            <h2>{pc.name}</h2>

            <ul className='spec-list'>
                {PART_TYPES.map(({ key, label }) => (
                    <li key={key}>
                        <strong>{label}:</strong> {pc[`${key}_name`] || '—'}
                    </li>
                ))}
            </ul>

            <h3 className='total'>Total: ${Number(pc.total_price).toLocaleString()}</h3>

            <div className='actions'>
                <Link to={`/edit/${pc.id}`} role='button'>Edit</Link>
                <button onClick={handleDelete} className='danger'>Delete</button>
            </div>
        </div>
    )
}

export default PCDetails
