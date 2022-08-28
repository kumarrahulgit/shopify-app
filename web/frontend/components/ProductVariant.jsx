import { useEffect, useState } from "react";
import styled from 'styled-components';
import { TextField } from "@shopify/polaris";

const Fieldset = styled.div`
  border: 1px solid mediumseagreen;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
`

export const ProductVariant = (props) => {
    const [variantData, setVariantData] = useState({...props.variant});

    const handleOptionChange = (newOption) => setVariantData({...variantData, option1: newOption});
    const handlePriceChange = (newPrice) => setVariantData({...variantData, price: newPrice});

    const handleBlur = () => {
        props?.onDataChange(variantData);   // Callback for updating parent component's state
    }

    // Update product variant data in parent component
    useEffect(() => {
        handleBlur();
    }, [props.variant]);

    return (
        <Fieldset>
            <TextField
                label="Variant option"
                value={variantData?.option1}
                onChange={handleOptionChange}
                onBlur={handleBlur}
                autoComplete="off"
            />
            <TextField
                label="Price"
                type="number"
                value={variantData?.price}
                onChange={handlePriceChange}
                onBlur={handleBlur}
                autoComplete="off"
            />
        </Fieldset>
    );
}
