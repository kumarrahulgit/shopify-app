import { useState } from 'react';
import styled from 'styled-components';
import { Button } from "@shopify/polaris";
import { ProductList } from './ProductList';
import { UpdateProductModal } from './UpdateProductModal';

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const FlexItem = styled.div`
  flex-basis: 50%;
  margin-bottom: 0.25rem;
`

export default function ProductPicker() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const handleSelection = (product) => {
    setProduct(product);
    setOpen(false);
    console.log(product);
  };

  const handleClick = () => {
    setProduct(null);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <ButtonContainer>
        <FlexItem>
          <Button onClick={handleClick} fullWidth>Update Product</Button>
        </FlexItem>
        <FlexItem>
        </FlexItem>
      </ButtonContainer>
      {!product
        ? (
          <ProductList open={open} onClose={handleClose} onSelection={handleSelection} />
        )
        : (
          <UpdateProductModal product={product} />
        )}
    </div>
  );
}
