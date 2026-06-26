// Feature-combination checks (which parts are/aren't compatible).
import { findOption } from './partTypes'

// Return a list of human-readable conflict messages. Empty array = valid build.
// Rule: a full-size GPU does not fit inside a mini case.
export const getConflicts = (selected, options) => {
    const conflicts = []
    const gpu = findOption(options, selected.gpu)
    const pcCase = findOption(options, selected.pc_case)

    if (gpu && pcCase && gpu.size === 'full' && pcCase.size === 'mini') {
        conflicts.push(
            `${gpu.name} is a full-size card and won't fit in the ${pcCase.name}. Pick a larger case or a compact GPU.`
        )
    }
    return conflicts
}
