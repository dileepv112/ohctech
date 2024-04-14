import {AgGridReact} from 'ag-grid-react';
import { Box, Button, Stack, ButtonGroup } from "@mui/material";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import ImportExportRoundedIcon from "@mui/icons-material/ImportExportRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useAxiosPrivate from '../../utils/useAxiosPrivate';
// import  {userValidationForm}  from './Validationform';
import { roleValidationForm } from './Validationform';
import Popup from "./Popup";
import RoleForm from './RoleForm';
import { useFormik } from "formik";
import { useState,useEffect } from "react";

const RoleList = () => {

  const initialValues = {
    rolename: "",
    roledes: "",
    homepage: "",
    rolecode: "",
    iconcolor: "",
    icontext: "",
  };

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: roleValidationForm,
    onSubmit: (values, action) => {
      console.log(values);
      action.resetForm();
    },
  });

  const axiosClientPrivate = useAxiosPrivate();

  const [rowData, setRowData] = useState([]);

  const [colDefs, setColDefs] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  
  const CustomActionComponent = (props) => {
    return <> <Button onClick={() => console.log(props.data)}> <EditNoteRoundedIcon /></Button>
        <Button color="error" onClick={() => window.alert('alert')}><DeleteSweepRoundedIcon /></Button> </>
};

const pagination = true;
const paginationPageSize = 50;
const paginationPageSizeSelector = [50, 100, 200, 500];

useEffect(() => {
    const controller = new AbortController();

    const getAllOhc = async () => {
        try {
            const response = await axiosClientPrivate.get('ohcs', { signal: controller.signal });
            const items = response.data;

            if (items.length > 0) {
                const columns = Object.keys(items[0]).map(key => ({
                    field: key,
                    headerName: key.charAt(0).toUpperCase() + key.slice(1),
                    filter: true,
                    floatingFilter: true,
                    sortable: true
                }));

                columns.push({
                    field: "Actions", cellRenderer: CustomActionComponent
                });

                setColDefs(columns);
            }

            setRowData(items);

        } catch (err) {
            console.error("Failed to fetch data: ", err);
            setRowData([]);
        }
    };

    getAllOhc();

    return () => {
        controller.abort();
    };

}, []);

  return (
    <>
      <Box
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // adjust width as necessary
      >
        <Stack
          sx={{ display: "flex", flexDirection: "row" }}
          marginY={1}
          paddingX={1}
        >
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              variant="contained"
              endIcon={<AddCircleOutlineRoundedIcon />}
              onClick={() => {
                setOpenPopup(true);
              }}
            >
              Add New
            </Button>
            <Button
              variant="contained"
              color="success"
              endIcon={<ImportExportRoundedIcon />}
            >
              Export Data
            </Button>
          </ButtonGroup>
        </Stack>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            animateRows={true} // Optional: adds animation to row changes
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
       />
      </Box>

      <Popup
        resetForm={resetForm}
        handleSubmit={handleSubmit}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title="Fill The Details To Add New Role"
      >
        <RoleForm
          values={values}
          touched={touched}
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          handleSubmit={handleSubmit}
        />
      </Popup>
    </>
  );
};

export default RoleList;
