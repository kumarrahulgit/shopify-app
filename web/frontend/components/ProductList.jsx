import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuthenticatedFetch } from "../hooks";
import { ImageMajor } from '@shopify/polaris-icons';
import {
  Spinner,
  Modal,
  RadioButton
} from '@shopify/polaris';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const FlexItem = styled.div`
  flex-basis: 50%;
  text-align: center;
  padding: 5rem;
`

const ProductCard = styled.div`
  padding: 0.5rem;
  border: 1px solid mediumseagreen;
  border-radius: 5px;
  margin: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProductCardImage = styled.img`
  display: block;
  max-width: 100px;
  height: auto;
`

export function ProductList(props) {
  const fetch = useAuthenticatedFetch();
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(({ data }) => {
      console.log(data);
      setIsLoading(false);
      setItems(data?.body?.products || []);
    });
  }, [props?.open]);

  const handleChange = useCallback(
    (_checked, newValue) => setValue(newValue),
    [],
  );

  // Update product data on product selection
  useEffect(() => {
    if (value) {
      setProduct(items.find(item => item.id === value));
    }
  }, [value]);

  return (
    <Modal
      open={props?.open}
      large
      onClose={props?.onClose}
      title="Select a product"
      primaryAction={{
        content: 'Select Product',
        onAction: () => props?.onSelection(product),
        disabled: !Boolean(value) // Make sure that a product is selected before moving onto next screen
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: props?.onClose
        }
      ]}>
      {isLoading
        ? (
          <Container>
            <FlexItem>
              <Spinner accessibilityLabel="Loading products" size="large" />
            </FlexItem>
          </Container>
        )
        : (<>
          {items.map((item) => (<ProductCard key={item.id}>
            <div>
              <RadioButton
                checked={value === item.id}
                onChange={handleChange}
                id={item.id}
                name="products"
                label={item.title}
                helpText={item.product_type}
              />
            </div>
            <div>
              <ProductCardImage src={item?.images[0]?.src || ImageMajor} alt="" />
            </div>
          </ProductCard>))}
        </>)
      }
    </Modal>
  );
}
