import {
  DateField,
  MarkdownField,
  Show,
  TextField,
} from "@refinedev/antd";
import { useOne, useShow, useMany } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const BlogPostShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const categoryIds = record?.category_ids ?? [];
  const { data: categoryData } = useMany({
    resource: "Categories",
    ids: categoryIds,
  });

  const authorId = record?.author_id;
  const { data: authorData } = useOne({
    resource: "Authors",
    id: authorId,
  });

  const categoryNames = categoryData?.data?.map((category:any) => category.title) || [];

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?._id ?? ""} />
      <Title level={5}>{"Title"}</Title>
      <TextField value={record?.title} />
      <Title level={5}>{"Content"}</Title>
      <MarkdownField value={record?.content} />
      <Title level={5}>{"Author"}</Title>
      <TextField value={authorData?.data?.name} />
      <Title level={5}>{"Categories"}</Title>
      <TextField value={categoryNames.join(", ")} />
      <Title level={5}>{"Status"}</Title>
      <TextField value={record?.status} />
      <Title level={5}>{"Created At"}</Title>
      <DateField value={record?.created_at} />
    </Show>
  );
};
