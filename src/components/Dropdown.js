import React, { useState } from 'react';
import './Dropdown.css';
import { AiOutlineArrowDown, AiOutlineClose } from 'react-icons/ai';

const Dropdown = ({ title, items, selectionHandle}) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <div className='d-container'>
            <div className='d-header'
                onClick={() => toggle(!open)}
            >
                <div className='d-title'>{title}
                </div>
                <div className='d-toggle'>
                    {open ? <AiOutlineClose/> : <AiOutlineArrowDown/>}
                </div>
            </div>
            <div className='d-list-wrapper'>
                {open && (
                    <ul className='d-list'>
                        {items.map(item => (
                            <li className='d-list-item' key={item.id} onClick={()=> selectionHandle(item)}>
                                <div>{item.value}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}


export default Dropdown;
