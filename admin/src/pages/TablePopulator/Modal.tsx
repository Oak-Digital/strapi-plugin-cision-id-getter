import React, { FC, useMemo, useState } from "react";
import {
  useContentTypes,
  useVisibleContentTypes,
} from "../../lib/queries/content-types";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  Combobox,
  ComboboxOption,
  Box,
  Field,
  Flex,
  FieldLabel,
  FieldInput,
  Checkbox,
  BaseCheckbox,
} from "@strapi/design-system";
import { NewsfeedRelease } from "../../types/cision";
import {
  Formik,
  Form,
  useFormikContext,
  withFormik,
  Field as FormikField,
} from "formik";
import { request } from "@strapi/helper-plugin";

type Props = {
  open?: boolean;
  onClose?: () => void;
  selectedReleases: NewsfeedRelease[];
};

const releaseFields: readonly (keyof NewsfeedRelease)[] = [
  "Id",
  "EncryptedId",
  "CisionWireUrl",
  "CanonicalUrl",
  "Title",
  "PublishDate",
  "LanguageCode",
] as const;

type Inputs = {
  autoPublish: boolean;
  fields: Record<string, keyof NewsfeedRelease | null>;
}

const TablePopulatorModal: FC<Props> = ({
  open,
  onClose = () => { },
  selectedReleases,
}) => {
  const { data } = useVisibleContentTypes({
    enabled: open,
  });
  const [selectedContentType, setSelectedContentType] = useState<string | null>(
    null
  );

  const selectedContentTypeData = useMemo(() => {
    return data?.find((contentType) => contentType.uid === selectedContentType);
  }, [data, selectedContentType]);

  const attributes = selectedContentTypeData?.schema.attributes;

  const initialFields = Object.entries(attributes ?? {}).reduce(
    (acc, [attributeName, attribute]) => {
      return {
        ...acc,
        [attributeName]: null,
      };
    },
    {}
  ) as Record<
    keyof Exclude<typeof attributes, undefined>,
    null | (typeof releaseFields)[number]
  >

  // const FormikTyped = Formik<Inputs>

  return (
    <>
      {open && (
        <Formik
          initialValues={{
            fields: initialFields,
            autoPublish: false,
          }}
          onSubmit={async (values) => {
            // console.log(values);

            const createEntry = async (release: NewsfeedRelease) => {
              const body = Object.entries(values.fields).reduce(
                (acc, [attributeName, attributeValue]) => {
                  if (attributeValue === null) {
                    return acc;
                  }
                  return {
                    ...acc,
                    [attributeName]: release[attributeValue],
                  };
                },
                {}
              );

              const result = await request(
                `/content-manager/collection-types/${selectedContentType}`,
                {
                  method: "POST",
                  body,
                }
              );

              console.log(result);
              const id = result.id;

              if (values.autoPublish) {
                await request(
                  `/content-manager/collection-types/${selectedContentType}/${id}/actions/publish`,
                  {
                    method: "POST",
                  }
                );
              }
            };

            for (const release of selectedReleases) {
              await createEntry(release);
              console.log('created entry', release);
              // TODO: show toast?
            }

            onClose();
          }}
        >
          {({
            submitForm,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <ModalLayout onClose={onClose} labelledBy="title">
              <ModalHeader>
                <Typography
                  fontWeight="bold"
                  textColor="neutral800"
                  as="h2"
                  id="title"
                >
                  Title
                </Typography>
              </ModalHeader>
              <ModalBody>
                <Form>
                  <Flex direction="column" alignItems="stretch" gap={8}>
                    <Combobox
                      // name="contentType"
                      placeholder="Content type..."
                      label="Content type"
                      value={selectedContentType}
                      onChange={setSelectedContentType}
                      onClear={() => setSelectedContentType(null)}
                    >
                      {data?.map((contentType) => (
                        <ComboboxOption
                          key={contentType.uid}
                          value={contentType.uid}
                        >
                          {contentType.schema.displayName}
                        </ComboboxOption>
                      ))}
                    </Combobox>
                    {selectedContentType && attributes && (
                      <Box>
                        <Flex direction="column" alignItems="stretch" gap={2}>
                          {Object.entries(attributes).map(
                            ([attributeName, attribute]) => {
                              return (
                                <FormikField name={`fields.${attributeName}`}>
                                  {({ field }) => (
                                    <Combobox
                                      key={attributeName}
                                      label={attributeName}
                                      name={field.name}
                                      placeholder="Field from cision..."
                                      value={field.value ?? null}
                                      onChange={(value) => {
                                        setFieldValue(field.name, value);
                                      }}
                                      // onBlur={field.onBlur}
                                      onClear={() => {
                                        setFieldValue(field.name, null);
                                      }}
                                    >
                                      {releaseFields.map((fieldName, i) => (
                                        <ComboboxOption
                                          value={fieldName}
                                          key={i}
                                        >
                                          {fieldName}
                                        </ComboboxOption>
                                      ))}
                                    </Combobox>
                                  )}
                                </FormikField>
                              );
                            }
                          )}
                        </Flex>
                      </Box>
                    )}
                    <FormikField name={"autoPublish"}>{({ field }) => (
                      <Checkbox value={field.value} onChange={(e) => {
                        const value = e.target.checked;
                        setFieldValue(field.name, value);
                      }}>
                        Auto publish
                      </Checkbox>
                    )}
                    </FormikField>
                  </Flex>
                </Form>
              </ModalBody>
              <ModalFooter
                startActions={
                  <Button onClick={onClose} variant="tertiary">
                    Cancel
                  </Button>
                }
                endActions={
                  <>
                    {/* <Button variant="secondary">Add new stuff</Button> */}
                    {/* <Button onClick={() => setIsVisible((prev) => !prev)}> */}
                    {/*   Finish */}
                    {/* </Button> */}
                    <Button onClick={submitForm} disabled={isSubmitting}>
                      Finish
                    </Button>
                  </>
                }
              />
            </ModalLayout>
          )}
        </Formik>
      )}
    </>
  );
};

export default TablePopulatorModal;
