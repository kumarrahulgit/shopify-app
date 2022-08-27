import { useState, useEffect, useCallback } from 'react';
import { useAuthenticatedFetch } from "../hooks";
import styled from 'styled-components';
import {
  Spinner,
  Modal,
  Card,
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
  }, []);

  const handleChange = useCallback(
    (_checked, newValue) => setValue(newValue),
    [],
  );

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
        disabled: !Boolean(value)
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
          {items.map((item) => (<Card key={item.id}>
            <RadioButton
              checked={value === item.id}
              onChange={handleChange}
              id={item.id}
              name="products"
              label={item.title}
              helpText={item.product_type}
            />
          </Card>))}
        </>)
      }
    </Modal>
  );
}
