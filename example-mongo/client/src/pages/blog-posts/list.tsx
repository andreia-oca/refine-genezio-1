import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
  
} from "@refinedev/antd";
import { BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";
import { Author, BlogPost } from "@genezio-sdk/refine-mongo"


export const BlogPostList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const authorIds = tableProps?.dataSource?.map((record: BlogPost) => record.author_id) || [];

  const { data: authorsData, isLoading: isAuthorsLoading } = useMany<Author>({
      resource: "Authors",
      ids: authorIds,
    })

  return (
    <List>
      <Table {...tableProps} rowKey="_id">
        <Table.Column dataIndex="_id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="content"
          title={"Content"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column
          dataIndex="author_id"
          title={"Author"}
          render={(value: any) => {
            const author = authorsData?.data?.find((author) => author._id === value);
            return author?.name || "unknown";
          }}
        />
        <Table.Column dataIndex="status" title={"Status"} />
        <Table.Column
          dataIndex={["created_at"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record._id} />
              <ShowButton hideText size="small" recordItemId={record._id} />
              <DeleteButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
