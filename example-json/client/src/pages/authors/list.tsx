import React, { useState, useEffect, useRef } from "react";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, CrudFilters, CrudSorting } from "@refinedev/core";
import { Space, Table, Input, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const AuthorList: React.FC = () => {
  const { tableProps, setFilters, setCurrent, setSorters } = useTable({
    syncWithLocation: true,
  });

  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(searchValue);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const oldValue = useRef<string | null>(null);

  useEffect(() => {
    // Debounce logic
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300); // 300ms debounce time

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchValue]);

  useEffect(() => {
    if (
      oldValue.current !== debouncedValue &&
      (debouncedValue.length >= 3 || debouncedValue.length === 0)
    ) {
      const newFilters: CrudFilters = [
        {
          field: "name",
          operator: "contains",
          value: debouncedValue.length >= 3 ? debouncedValue : undefined,
        },
      ];

      setFilters(newFilters);
      setCurrent(1); // Reset to the first page when filters change

      oldValue.current = debouncedValue;
    }
  }, [debouncedValue, setFilters, setCurrent]);

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    const sorters: CrudSorting = [];
    if (sorter.field && sorter.order) {
      sorters.push({
        field: sorter.field,
        order: sorter.order === "ascend" ? "asc" : "desc",
      });
    }
    setSorters(sorters);
    setCurrent(pagination.current); // Ensure pagination state is updated
  };

  return (
    <List>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item>
          <Input
            placeholder="Search name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>
      </Form>
      <Table
        {...tableProps}
        rowKey="id"
        onChange={handleTableChange} // Add onChange handler
      >
        <Table.Column dataIndex="id" title={"ID"} sorter />
        <Table.Column dataIndex="name" title={"Name"} sorter />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
