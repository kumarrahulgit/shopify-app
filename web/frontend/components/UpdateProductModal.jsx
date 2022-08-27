import { useState, useCallback, useEffect } from "react";
import styled from 'styled-components';
import { Modal, DropZone, Stack, FormLayout, Form, TextField, Select, Caption } from "@shopify/polaris";
import { NoteMinor } from '@shopify/polaris-icons';
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

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

const ErrorDiv = styled.div`
  color: red;
`

export function UpdateProductModal(props) {
  const emptyToastProps = { content: null };
  const [active, setActive] = useState(true);
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
      const productId = props?.product?.id;
      fetch(`/api/products/update/${productId}`, {
        method: "PUT",
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
        if(response?.body?.product) {
          toggleActive();
        }
      }).catch((err) => {
        setToastProps({content: "Error updating product"});
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

    useEffect(() => {
        if(props?.product) {
            console.log(props.product);
            setProductTitle(props.product?.title || "");
            setProductType(props.product.product_type || "");
            setProductDescription(props.product?.body_html || "");
        }
    },[])

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
        {!isProductUpdated ? <p>Error creating product</p> : null}
      </ErrorDiv>
    </Stack>
  );

  return (
    <div>
      {toastMarkup}
      <Modal
        large
        open={active}
        onClose={toggleActive}
        title="Update Product"
        primaryAction={{
          content: 'Update Product',
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
