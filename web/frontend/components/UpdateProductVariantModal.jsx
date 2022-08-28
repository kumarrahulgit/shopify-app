import React, { useState, useCallback, useEffect } from "react";
import styled from 'styled-components';
import { Modal, Stack, FormLayout, Form, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { ProductVariant } from "./ProductVariant";

const ButtonContainer = styled.div`
  margin: 0.25rem auto;
`

export function UpdateProductVariantModal(props) {
  const emptyToastProps = { content: null };
  const [active, setActive] = useState(true);
  const [variants, setVariants] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);

  // Initial product variant data
  let variantData = {
    key: "",
    option1: "",
    price: 0
  };

  const fetch = useAuthenticatedFetch();

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (variants.length) {
      setIsFormValid(true);
      const productId = props?.product?.id;

      // Loop through variants and create or update them
      for (let i = 0; i < variants.length; ++i) {
        if (variants[i].id) {
          fetch(`/api/products/variants/update/${variants[i].id}`, {
            method: "PUT",
            body: JSON.stringify({
              option1: variants[i].option1,
              price: variants[i].price
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json()).then(({ response }) => {
          }).catch((err) => {
            setToastProps({ content: "Error updating product" });
            setIsSubmitting(false);
          });
        } else {
          fetch(`/api/products/${productId}/variants/create`, {
            method: "POST",
            body: JSON.stringify({
              option1: variants[i].option1,
              price: variants[i].price
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json()).then(({ response }) => {
          }).catch((err) => {
            setToastProps({ content: "Error updating product" });
            setIsSubmitting(false);
          });
        }
      }
      setIsSubmitting(false);
      toggleActive();
    } else {
      setIsFormValid(false);
      setToastProps({ content: "All fields are required" });
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    variantData.key = Math.random().toString(16); // Random string for key
    setVariants([...variants, variantData]);
  }

  const handleDelete = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants([...newVariants]);
  }

  const handleDataChange = (data) => {
    const newVariants = [...variants];
    const index = newVariants.findIndex(elem => elem.key === data.key);

    if (index === -1) {
      newVariants.push(data);
    } else {
      newVariants.splice(index, 1, data);
    }

    setVariants([...newVariants]);
  }

  // Update product variants data from props
  useEffect(() => {
    if (props?.product?.variants) {
      console.log(props?.product?.variants);
      const newVariants = props?.product?.variants.map(elem => {
        const { id, option1, price } = elem;
        return {
          id,
          key: Math.random().toString(16),
          option1,
          price
        }
      });
      setVariants([...newVariants]);
    }
  }, []);

  return (
    <div>
      {toastMarkup}
      <Modal
        large
        open={active}
        onClose={toggleActive}
        title="Update Product Variants"
        primaryAction={{
          content: 'Update Product Variants',
          onAction: handleSubmit,
          loading: isSubmitting
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: toggleActive
          }
        ]}
      >
        <Modal.Section>
          <Stack vertical>
            <Form>
              <FormLayout>
                {variants.map((variant, index) => (
                  <div key={variant.key}>
                    <ProductVariant variant={variant} onDelete={handleDelete} onDataChange={handleDataChange} />
                    <ButtonContainer>
                      <Button onClick={() => handleDelete(index)}>Delete</Button>
                    </ButtonContainer>
                  </div>
                ))}
              </FormLayout>
            </Form>
          </Stack>
          <Stack vertical>
            <Button onClick={addVariant}>Add Variant</Button>
          </Stack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
