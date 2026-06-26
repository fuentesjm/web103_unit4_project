import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllPCs, deletePC } from '../services/PCsAPI'
import '../App.css'

const ViewPCs = ({ title }) => {
    const [pcs, setPCs] = useState([])

    // Reusable loader so we can refresh the list after a delete.
    const fetchPCs = async () => {
        const data = await getAllPCs()
        setPCs(data)
    }

    useEffect(() => {
        document.title = title
        fetchPCs()
    }, [title])

    const handleDelete = async (id) => {
        await deletePC(id)
        fetchPCs() // refresh the list in place
    }

    return (
        <div className='view-pcs'>
            <h2>My Builds</h2>

            {pcs.length === 0 ? (
                <p>
                    No builds yet. <Link to='/'>Create one →</Link>
                </p>
            ) : (
                <div className='pc-grid'>
                    {pcs.map((pc) => (
                        <div className='pc-card' key={pc.id}>
                            <Link to={`/pcs/${pc.id}`} className='pc-card-link'>
                                <h3>{pc.name}</h3>
                                <p className='price'>${Number(pc.total_price).toLocaleString()}</p>
                            </Link>
                            <div className='card-actions'>
                                <Link to={`/edit/${pc.id}`} role='button' className='outline'>
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(pc.id)} className='danger'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ViewPCs
