import { useState } from "react"

const  useDropdown = () => {
    const [isDropdownOpen, setDropdownIsOpen] = useState(false)

    const openDropdown = () => setDropdownIsOpen(true)
    const closeDropdown = () => setDropdownIsOpen(false)

    return {isDropdownOpen, openDropdown, closeDropdown}
}

export default useDropdown