import {registerBlockType} from '@wordpress/blocks';
import {RichText} from '@wordpress/block-editor';
import {Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {closeSmall, dragHandle} from '@wordpress/icons';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

import './style.scss';

const SortableItem = SortableElement(
    ({items, value, myIndex, onChange, RemoveItem}) => (
        <div className='sortable-block__item'>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Button className='button-drag-item' icon={dragHandle} />
                <Button
                    className='button-remove-item'
                    icon={closeSmall}
                    onClick={() => RemoveItem(myIndex)}
                />
            </div>
            <RichText
                style={{
                    margin: '14px',
                }}
                placeholder='Text'
                tagName='div'
                allowedFormats={[]}
                value={items[myIndex].text}
                onChange={(value) => onChange(value, myIndex)}
            />
        </div>
    ),
);

const SortableList = SortableContainer(({items, onChange, RemoveItem}) => {
    return (
        <div className='sortable-block'>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value}`}
                    index={index}
                    myIndex={index}
                    items={items}
                    onChange={onChange}
                    RemoveItem={RemoveItem}
                />
            ))}
        </div>
    );
});

registerBlockType('ay/sortable', {
    title: __('Sortable'),
    supports: {
        className: false,
    },
    attributes: {
        items: {
            type: 'array',
            default: [],
        },
    },

    edit(props) {

        const AddItem = () => {
            const items = [...props.attributes.items];
            items.push({
                text: '',
            });
            props.setAttributes({items});
        };

        const RemoveItem = (index) => {
            const items = [...props.attributes.items];
            items.splice(index, 1);
            props.setAttributes({items});
        };

        const ChangeItemText = (value, index) => {
            const items = [...props.attributes.items];
            items[index].text = value;
            props.setAttributes({items});
        };

        const onSortEnd = ({oldIndex, newIndex}) => {
            props.setAttributes({
                items: arrayMoveImmutable(
                    props.attributes.items,
                    oldIndex,
                    newIndex,
                ),
            });
        };

        return (
            <div className='sortable-block-container'>
                <SortableList
                    distance={10}
                    axis={'xy'}
                    items={props.attributes.items}
                    onSortEnd={onSortEnd}
                    onChange={ChangeItemText}
                    RemoveItem={RemoveItem}
                />
                <Button
                    className='button-add-item'
                    isSecondary
                    onClick={AddItem.bind(this)}
                >
                    {__('Add Item')}
                </Button>
            </div>
        );
    },

    save(props) {
        return (
            <div className='sortable-block'>
                {props.attributes.items.map((item, index) => (
                    <div className='sortable-block__item'>{item.text}</div>
                ))}
            </div>
        );
    },
});
