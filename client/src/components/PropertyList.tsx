import { Property } from "../services/Api"









interface PropertyCheckBox {
    checked: boolean
}

interface PropertyListProps {
    properties: Property[];
    showCheckBoxes: boolean;
    checkedProperties?: {[key: number]: PropertyCheckBox};
    handleCheckBoxChange?: (propertyId: number, checked: boolean) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties,
                                                       showCheckBoxes = false,
                                                       checkedProperties = {},
                                                       handleCheckBoxChange = () => {}, }) => {

    return (
        <>
            <div>
                <h2 className="text-xl font-semi">Properties:</h2>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <ul>
                        {properties.map((property => (
                            <li key={property.id}>

                                <div className="space-x-2">
                                    {showCheckBoxes && property.id !== undefined && (
                                        <input
                                        type="checkbox"
                                        checked={checkedProperties[property.id]?.checked || false}
                                        onChange={(e) => handleCheckBoxChange && handleCheckBoxChange(property.id!, e.target.checked)}
                                        onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                <span>{property.propertyName}</span>
                                </div>
                            </li>
                        )))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default PropertyList;