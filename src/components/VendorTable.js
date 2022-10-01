import { Form, Popconfirm, Table, Typography, Button } from "antd";
import React, { useState } from "react";
import ApplicationTable from "./ApplicationTable";
import { amountFormatter } from "../utils/stringManipulationHelpers";
import EditableCell from "./EditableCell";

const VendorTable = (props) => {
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

      const newData = [...props.data];
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
        props.setData(newData);
        cancel(key);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const saveSubTableData = (key, dataToSave) => {
    const newData = [...props.data];
    const index = newData.findIndex((item) => key == item.key);
    if (index > -1) {
      newData[index] = {
        ...newData[index],
        [dataToSave.propertyName]: {
          isTable: true,
          values: dataToSave.valueArr,
        },
      };

      props.setData(newData);
      cancel(key);
    }
  };

  const columns = [
    {
      title: "VENDOR NAME",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      editable: true,
      inputType: "text",
    },
    {
      title: "# OF APPLICATIONS",
      dataIndex: "num_applications",
      key: "num_applications",
      render: (num) => {
        return num + " Apps";
      },
      sorter: (a, b) => a.num_applications - b.num_applications,
      editable: true,
      inputType: "number",
    },
    {
      title: "TOTAL SPEND (YTD)",
      dataIndex: "total_spend_ytd",
      key: "total_spend_ytd",
      render: (amount) => {
        return amountFormatter.format(amount);
      },
      sorter: (a, b) => a.total_spend_ytd - b.total_spend_ytd,
      editable: true,
      inputType: "number",
    },
    {
      title: "ACTIVE CONTRACT",
      dataIndex: "contract_active",
      key: "contract_active",
      render: (active) => {
        if (active) {
          return "Active";
        } else {
          return "Inactive";
        }
      },
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      key: "source",
      editable: true,
      inputType: "text",
    },
    {
      title: "TOTAL SPEND (LAST 12 MONTHS)",
      dataIndex: "total_spend_year",
      key: "total_spend_year",
      render: (amount) => {
        return amountFormatter.format(amount);
      },
      sorter: (a, b) => a.total_spend_year - b.total_spend_year,
      editable: true,
      inputType: "number",
    },
    {
      title: "CONTRACT VALUE",
      dataIndex: "contract_value",
      key: "contract_value",
      render: (amount) => {
        return amountFormatter.format(amount);
      },
      sorter: (a, b) => a.contract_value - b.contract_value,
      editable: true,
      inputType: "number",
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
          <Button onClick={() => edit(record)} type="primary">
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
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <>
                  {Object.keys(record).map((item, index) => {
                    if (record[item].isTable) {
                      return (
                        <ApplicationTable
                          key={index}
                          appData={record[item].values}
                          containerTableKey={record.key}
                          saveToData={saveSubTableData}
                          propertyName={item}
                        />
                      );
                    }
                  })}
                </>
              );
            },
            defaultExpandedRowKeys: ["0"],
          }}
          dataSource={props.data}
        />
      </Form>
    </>
  );
};

export default VendorTable;
