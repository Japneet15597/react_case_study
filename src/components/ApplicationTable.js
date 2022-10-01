import { Form, Typography, Popconfirm, Table, Button } from "antd";
import React, { useState } from "react";
import EditableCell from "./EditableCell";

const ApplicationTable = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState([]);

  const isEditing = (record) => {
    return editingKey.includes(record.key);
  };

  const edit = (record) => {
    const valuesArr = columns.filter((item) => item.editable);

    const valuesObj = {};

    for (let i = 0; i < valuesArr.length; i++) {
      valuesObj[`${valuesArr[i].dataIndex}.${record.key}`] =
        record[valuesArr[i].dataIndex];
    }

    form.setFieldsValue({
      ...valuesObj,
      ...record,
    });

    setEditingKey([...editingKey, record.key]);
  };

  const cancel = (key) => {
    const newEditingKey = [...editingKey];

    for (var i = 0; i < newEditingKey.length; i++) {
      if (newEditingKey[i] === key) {
        newEditingKey.splice(i, 1);
      }
    }

    setEditingKey(newEditingKey);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const newData = [...props.appData];
      const index = newData.findIndex((item) => key == item.key);

      const propertyNamesToSave = Object.keys(row).filter((item) =>
        item.includes(key)
      );

      const valuesToSave = {};

      for (let i = 0; i < propertyNamesToSave.length; i++) {
        const propName = propertyNamesToSave[i].split(".")[0];

        valuesToSave[propName] = row[propertyNamesToSave[i]];
      }

      if (index > -1) {
        newData[index] = { ...newData[index], ...valuesToSave };

        props.saveToData(props.containerTableKey, {
          propertyName: props.propertyName,
          valueArr: newData,
        });
        cancel(key);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "APPLICATION NAME",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      editable: true,
      inputType: "text",
    },
    {
      title: "VENDOR",
      dataIndex: "vendor",
      key: "vendor",
      editable: true,
      inputType: "text",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      editable: true,
      inputType: "text",
    },
    {
      title: "LICENSES BOUGHT",
      dataIndex: "licenses_bought",
      key: "licenses_bought",
      editable: true,
      inputType: "number",
      sorter: (a, b) => a.licenses_bought - b.licenses_bought,
    },
    {
      title: "APP COVERED IN CONTRACT",
      dataIndex: "covered",
      key: "covered",
    },
    {
      title: "BILLING FREQUENCY",
      dataIndex: "billing_frequency",
      key: "billing_frequency",
    },
    {
      title: "PAYMENT TERMS",
      dataIndex: "payment_terms",
      key: "payment_terms",
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => cancel(record.key)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Button onClick={() => edit(record)} type="link">
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        size="small"
        columns={mergedColumns}
        dataSource={props.appData}
        pagination={false}
      />
    </Form>
  );
};

export default ApplicationTable;
