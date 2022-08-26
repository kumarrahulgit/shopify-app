import { useState, useCallback } from "react";
import { Button, Modal, DropZone, Stack, FormLayout, Form, TextField, Select, Thumbnail, Caption } from "@shopify/polaris";
import styled from 'styled-components';
import { NoteMinor } from '@shopify/polaris-icons';
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const ImageUploadContainer = styled.div`
  width: min(25%, 125px);
  height: min(25%, 125px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`

const UploadedImage = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
`

const FlexItem = styled.div`
  flex-basis: 50%;
`
const ErrorDiv = styled.div`
  color: red;
`

export function CreateProductButton() {
  const emptyToastProps = { content: null };
  const [active, setActive] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productType, setProductType] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState();
  const [isFormValid, setIsFormValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  const fetch = useAuthenticatedFetch();

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleSubmit = () => {
    setIsSubmitting(true);
    if(productTitle && productType) {
      setIsFormValid(true);
      fetch("/api/products/create", {
        method: "POST",
        body: JSON.stringify({
          productTitle,
          productType,
          productDescription
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(({response}) => {
        setIsSubmitting(false);
        if(response?.product) {
          toggleActive();
        }
      }).catch((err) => {
        setToastProps({content: "Error creating product"});
        setIsSubmitting(false);
      });
    } else {
      setIsFormValid(false);
      setIsSubmitting(false);
    }
  };
  const handleProductTitleChange = useCallback((newValue) => setProductTitle(newValue), []);
  const handleProductTypeChange = useCallback((value) => setProductType(value), []);
  const handleProductDescriptionChange = useCallback((newValue) => setProductDescription(newValue), []);
  const handleProductImageDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setProductImage((file) => acceptedFiles[0]),
    []
  );
  const imageUpload = !productImage && <DropZone.FileUpload />;
  const uploadedImage = productImage && (
    <Stack>
      <UploadedImage
        src={
          validImageTypes.includes(productImage.type)
            ? window.URL.createObjectURL(productImage)
            : NoteMinor
        }
        alt={productImage.name}
      />
      <div>
        {productImage.name} <Caption>{productImage.size} bytes</Caption>
      </div>
    </Stack>
  );
  const errorMessage = !isFormValid && (
    <Stack>
      <ErrorDiv>
        {!productTitle ? <p>Product title is required</p> : null}
        {!productType ? <p>Product type is required</p> : null}
        {!isProductCreated ? <p>Error creating product</p> : null}
      </ErrorDiv>
    </Stack>
  );

  return (
    <div>
      {toastMarkup}
      <ButtonContainer>
        <FlexItem>
          <Button onClick={toggleActive} fullWidth>Create Product</Button>
        </FlexItem>
        <FlexItem>
        </FlexItem>
      </ButtonContainer>
      <Modal
        large
        open={active}
        onClose={toggleActive}
        title="Create Product"
        primaryAction={{
          content: 'Create Product',
          onAction: handleSubmit,
          loading: isSubmitting
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: toggleActive
          },
        ]}
      >
        <Modal.Section>
          <Stack vertical>
            <Form>
              <FormLayout>
                <TextField
                  label="Product Title"
                  value={productTitle}
                  onChange={handleProductTitleChange}
                  autoComplete="off"
                />
                <Select
                  id="product-type"
                  label="Product Type"
                  placeholder="Select Product Type"
                  options={['Electronics', 'Books', 'Medicine', 'Apparel', 'Food']}
                  value={productType}
                  onChange={handleProductTypeChange}
                />
                <TextField
                  label="Product Description"
                  value={productDescription}
                  onChange={handleProductDescriptionChange}
                  multiline={4}
                  autoComplete="off"
                />
                <ImageUploadContainer>
                  <DropZone
                    allowMultiple={false}
                    accept=".png,.jpg,.jpeg"
                    errorOverlayText="Image type must be .png, .jpg, .jpeg"
                    type="image"
                    outline={false}
                    onDrop={handleProductImageDrop}
                  >
                    {uploadedImage}
                    {imageUpload}
                  </DropZone>
                </ImageUploadContainer>
                {errorMessage}
              </FormLayout>
            </Form>
          </Stack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
