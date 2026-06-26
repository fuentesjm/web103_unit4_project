// Price calculation utilities.
import { PART_TYPES, findOption } from './partTypes'

// Price of a single selected option (0 if nothing is chosen for that slot).
export const getOptionPrice = (options, id) => {
    const opt = findOption(options, id)
    return opt ? Number(opt.price) : 0
}

// Total price of the whole build = sum of every selected part's price.
export const calcTotalPrice = (selected, options) => {
    return PART_TYPES.reduce(
        (sum, { key }) => sum + getOptionPrice(options, selected[key]),
        0
    )
}
