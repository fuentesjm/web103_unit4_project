// Shared config + helpers used by the price and validation utilities,
// and by the form pages to render the dropdowns.

// The five part categories every build has, in display order.
export const PART_TYPES = [
    { key: 'cpu', label: 'CPU' },
    { key: 'gpu', label: 'GPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'pc_case', label: 'Case' },
]

// Turn the flat option list into { cpu: [...], gpu: [...], ... }
export const groupByType = (options) => {
    const grouped = {}
    for (const { key } of PART_TYPES) grouped[key] = []
    for (const opt of options) {
        if (grouped[opt.type]) grouped[opt.type].push(opt)
    }
    return grouped
}

// Find a single option object by its id (ids arrive from <select> as strings).
export const findOption = (options, id) =>
    options.find((o) => String(o.id) === String(id))
