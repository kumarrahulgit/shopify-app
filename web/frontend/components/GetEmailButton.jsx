import { useState } from "react";
import { Button } from "@shopify/polaris";
import styled from 'styled-components';
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const FlexItem = styled.div`
  flex-basis: 50%;
`

export function GetEmailButton() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleGetEmail = () => {
    setIsLoading(true);
    fetch("/api/store/email").then(res => res.json()).then(({data}) => {
      setIsLoading(false);
      setEmail(data?.body?.shop?.email);
    });
  };

  return (
    <>
      {toastMarkup}
      <ButtonContainer>
        <FlexItem>
          <Button onClick={handleGetEmail} loading={isLoading} disabled={isLoading} fullWidth>Get Store Email</Button>
        </FlexItem>
        <FlexItem>
          {email}
        </FlexItem>
      </ButtonContainer>
    </>
  );
}
