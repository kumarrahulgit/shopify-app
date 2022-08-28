import {
  Card,
  Page,
  Layout,
  TextContainer,
  Stack,
  Heading,
} from "@shopify/polaris";
import styled from 'styled-components';
import { TitleBar } from "@shopify/app-bridge-react";
import { CreateProductButton } from "../components";
import { GetEmailButton } from "../components/GetEmailButton";
import ProductPicker from "../components/ProductPicker";
import ProductVariantsPicker from "../components/ProductVariantsPicker";

const Paragraph = styled.p`
  margin: 1rem auto;
  font-weight: bold;
`

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="Shopify App" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Shopify Development App</Heading>
                  <Paragraph>
                    REST APIs
                  </Paragraph>
                </TextContainer>
              </Stack.Item>
            </Stack>
            <Stack>
              <Stack.Item fill>
                <GetEmailButton />
              </Stack.Item>
            </Stack>
            <Stack>
              <Stack.Item fill>
                <CreateProductButton />
              </Stack.Item>
            </Stack>
            <Stack>
              <Stack.Item fill>
                <ProductPicker />
              </Stack.Item>
            </Stack>
            <Stack>
              <Stack.Item fill>
                <ProductVariantsPicker />
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
