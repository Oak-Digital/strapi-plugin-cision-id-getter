import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Main,
  HeaderLayout,
  ContentLayout,
  LinkButton,
  Button,
  Box,
  Flex,
  Grid,
  Field,
  FieldLabel,
  FieldInput,
  FieldError,
} from "@strapi/design-system";
import { useIntl } from "react-intl";
import pluginId from "../../pluginId";
import { Plus } from "@strapi/icons";
import ArticlesTable from "../../components/Tables/Articles";
import { useNewsfeed } from "../../lib/queries/newsfeed";
import TablePopulatorModal from "./Modal";

const TablePopulatorPage = () => {
  const { formatMessage } = useIntl();

  const [shouldLoadAll, setShouldLoadAll] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [newsfeedId, setNewsfeedId] = useState<string>("");

  useEffect(() => {
    setEnabled(false);
    setShouldLoadAll(false);
  }, [newsfeedId]);

  const { data, hasNextPage, isLoading, fetchNextPage } = useNewsfeed(
    newsfeedId,
    {
      enabled,
    }
  );

  if (shouldLoadAll && hasNextPage && !isLoading) {
    fetchNextPage();
  }

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.has(id)) {
        prev.delete(id);
        return new Set(prev);
      } else {
        return new Set(prev.add(id));
      }
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size >= 1) {
        return new Set();
      } else {
        return new Set(
          data?.pages.flatMap((page) =>
            page?.Releases.map((release) => release.EncryptedId)
          )
        );
      }
    });
  }, [data]);

  const selectedReleases = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        page?.Releases.filter((release) => selected.has(release.EncryptedId))
      ) ?? []
    );
  }, [data, selected]);

  return (
    <Main>
      <HeaderLayout
        title={formatMessage({
          id: `${pluginId}.settings.page.populator.title`,
          defaultMessage: "Newsfeed populator",
        })}
      />
      <ContentLayout>
        <Flex direction="column" alignItems="stretch" gap={4}>
          <Flex gap={4}>
            <Button
              disabled={!enabled ? false : !hasNextPage || isLoading || shouldLoadAll}
              onClick={() => {
                setEnabled(true);
                fetchNextPage();
              }}
            >
              Load more
            </Button>
            <Button
              disabled={!enabled ? false : !hasNextPage || shouldLoadAll}
              onClick={() => {
                setEnabled(true);
                setShouldLoadAll(true);
              }}
            >
              Load all
            </Button>
            <Button
              disabled={selected.size <= 0}
              onClick={() => setCreating(true)}
            >
              Create entries
            </Button>
          </Flex>
          <Field required={true}>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Newsfeed ID</FieldLabel>
              <FieldInput
                type="text"
                placeholder="Cision newsfeed id"
                onChange={(e) => {
                  setNewsfeedId(e.target.value);
                }}
              />
            </Flex>
          </Field>
        </Flex>
        <ArticlesTable
          data={data}
          onSelect={handleSelect}
          onSelectAll={selectAll}
          selected={selected}
        />
        <TablePopulatorModal
          open={creating}
          onClose={() => setCreating(false)}
          selectedReleases={selectedReleases}
        />
      </ContentLayout>
    </Main>
  );
};

export default TablePopulatorPage;
