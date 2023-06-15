import React, { FC, useCallback, useMemo } from "react";
import pluginId from "../../pluginId";
import { useEntireNewsfeed, useNewsfeed } from "../../lib/queries/newsfeed";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Typography,
  BaseCheckbox,
  Checkbox,
  Field,
} from "@strapi/design-system";
// import { Link } from "@strapi/design-system/v2";

type Props = {
  data: ReturnType<typeof useNewsfeed>["data"];
  selected: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
};

const COL_COUNT = 5;

const ArticlesTable: FC<Props> = ({
  data,
  selected,
  onSelectAll,
  onSelect,
}) => {
  const allSelected = useMemo(() => {
    return data?.pages.every((page) => {
      return page.Releases.every((release) =>
        selected.has(release.EncryptedId)
      );
    });
  }, [data, selected]);

  const ROW_COUNT = data?.pages.reduce((acc, page) => {
    return acc + (page.Releases.length ?? 0);
  }, 0);

  return (
    <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
      <Thead>
        <Tr>
          <Th>
            <BaseCheckbox
              aria-label="Select all entries"
              onChange={() => onSelectAll()}
              // checked={allSelected}
              value={allSelected}
              indeterminate={!allSelected && selected.size > 0}
            />
          </Th>
          <Th>
            <Typography variant="sigma">Id</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Title</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Link</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Actions</Typography>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.pages.map((page) => {
          return page?.Releases.map((release) => {
            return (
              <Tr>
                <Td>
                  <BaseCheckbox
                    value={selected.has(release.EncryptedId)}
                    // checked={selected.has(release.EncryptedId)}
                    onChange={() => onSelect(release.EncryptedId)}
                  />
                </Td>
                <Td
                  style={{
                    width: "190px",
                  }}
                >
                  {release.EncryptedId}
                </Td>
                <Td
                  style={{
                    maxWidth: "300px",
                  }}
                >
                  <p
                    style={{
                      maxWidth: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {release.Title}
                  </p>
                </Td>
                <Td
                  style={{
                    width: "64px",
                  }}
                >
                  <Link isExternal href={release.CisionWireUrl}>
                    Link
                  </Link>
                </Td>
                <Td>{/* Button for populating content types */}</Td>
              </Tr>
            );
          });
        })}
      </Tbody>
    </Table>
  );
};

export default ArticlesTable;
