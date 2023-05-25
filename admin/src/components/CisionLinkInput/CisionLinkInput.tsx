import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Grid,
  GridItem,
  Flex,
  Box,
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
  FieldInput,
  IconButton,
} from "@strapi/design-system";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";
import { useIdFromUrl } from "../../lib/queries/newsfeed";
import { Refresh } from "@strapi/icons";

const CisionLinkInput = ({
  attribute,
  description,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
}: any) => {
  const { formatMessage } = useIntl();
  const [url, setUrl] = useState("");

  const idObject = useIdFromUrl(url, attribute.options.newsFeedId);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateIdFromUrl();
  }, [idObject]);

  const updateIdFromUrl = () => {
    if (!idObject.valid) {
      return;
    }
    if (!idObject.found) {
      return;
    }
    if (!input.current) {
      return;
    }

    input.current.value = idObject.id.toString();
    // FIXME: This is a hack, but I don't know how to do this correctly... Thanks react :D
    onChange({
      target: input.current,
    });
  };

  return (
    <Field
      name={name}
      error={error}
      hint={description && formatMessage(description)}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <FieldLabel action={labelAction}>{formatMessage(intlLabel)}</FieldLabel>
        <Box padding={4} background="neutral100" hasRadius>
          <Grid gap={4}>
            <GridItem col={6}>
              <Field
                name={`${name}__url`}
                grow={1}
                error={
                  !idObject.valid
                    ? "The url is not valid"
                    : !idObject.isLoading && !idObject.found
                      ? "Could not find the release from the url"
                      : undefined
                }
              >
                <Flex
                  gap={1}
                  direction="column"
                  alignItems="stretch"
                  justifyContent="flex-start"
                >
                  <FieldLabel>
                    {formatMessage({
                      id: "CisionLinkInput.cisionUrl",
                      defaultMessage: "Cision URL",
                    })}
                  </FieldLabel>
                  <FieldInput
                    value={url}
                    onChange={(e: any) => {
                      setUrl(e.target.value);
                    }}
                  />
                  <FieldError />
                </Flex>
              </Field>
            </GridItem>
            <GridItem col={6}>
              <Flex
                gap={1}
                direction="column"
                alignItems="stretch"
                justifyContent="flex-start"
              >
                <FieldLabel>
                  {formatMessage({
                    id: "CisionLinkInput.cisionId",
                    defaultMessage: "Cision ID",
                  })}
                </FieldLabel>
                <FieldInput
                  ref={input}
                  value={value}
                  onChange={onChange}
                  endAction={
                    <IconButton noBorder disabled={!idObject.valid || idObject.isLoading || !idObject.found} variant="ghost" onClick={() => updateIdFromUrl()}>
                      <Refresh />
                    </IconButton>
                  }
                  disabled={idObject.valid && idObject.isLoading}
                />
                <FieldError />
              </Flex>
            </GridItem>
          </Grid>
        </Box>
        <FieldHint />
        <FieldError />
      </Flex>
    </Field>
  );
};

export default CisionLinkInput;
