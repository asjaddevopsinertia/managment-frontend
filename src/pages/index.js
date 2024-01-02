import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { CustomersTable } from "src/sections/customer/customers-table";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { DNA } from 'react-loader-spinner'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

const now = new Date();

const columns = [
  { id: 'product_name', label: 'Product Name', minWidth: 170 },
  { id: 'type', label: 'Type', minWidth: 100 },
  {
    id: 'quantity',
    label: 'Quantity',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'grams',
    label: 'Grams',
    minWidth: 170,
    align: 'right',

  },
];



const Page = () => {
  const [selectedRange, setSelectedRange] = useState("week");
  const [productData, setProductData] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [tranformedData, setTransformedData] = useState([])
  const [tranformedData1, setTransformedData1] = useState([])
  const [endValue, setEndValue] =  useState(dayjs(now))
  const [startValue, setStartValue] = useState(dayjs(now))
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([])
  const [rows2, setRows2] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let token = window.localStorage.getItem("token");
        const response = await axios.post(
          "https://management.marmaladegrove.com/orders/time-range",
          {
            range: "week",
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("re", response.data);
        setData(response.data);
        setProductData(Object.keys(response.data.order.productDetails));
        const transformedData = Object.keys(response.data.order.productDetails).reduce((result, productId) => {
          const products = response.data.order.productDetails[61394944053];
          Object.keys(products).forEach(productName => {
            const { quantity, totalGrams } = products[productName];
            result.push({
              product_name:productName,
              type: productName.includes('Fruit') ? 'Fruit' : 'Marmalade',
              quantity,
              grams: totalGrams
            });
          });
          return result;
        }, []);
        setTransformedData(transformedData);

        const transformedData1 = Object.keys(response.data.order.productDetails).reduce((result, productId) => {
          const products = response.data.order.productDetails[65769406517];
          Object.keys(products).forEach(productName => {
            const { quantity, totalGrams } = products[productName];
            result.push({
              product_name:productName,
              type: productName.includes('Fruit') ? 'Fruit' : 'Marmalade',
              quantity,
              grams: totalGrams
            });
          });
          return result;
        }, []);
        setRows(transformedData)
        setRows2(transformedData1)
        setTransformedData1(transformedData1);
        setLoading(false);
        // Do something with the response data here
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
        // Handle errors here
      }
    };

    fetchData();
  }, [selectedRange]);

  const handleChange = (event) => {
    setSelectedRange(event.target.value);
  };

  console.log("data", data?.order);

  console.log("start", dayjs(startValue))
  console.log("start", dayjs(endValue))
  console.log("transformed", tranformedData)
  console.log("transformed1", tranformedData1)
  console.log("rows", rows)
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container sx={{marginBottom: '25px'}}>
            <Grid xs={1} sm={6} lg={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Date</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedRange}
                  label="Date"
                  onChange={handleChange}
                >
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                  <MenuItem value="start">Start Of Week</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={1} sm={6} lg={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box components={["DateTimePicker"]}>
                  <DateTimePicker timezone="America/Los_Angeles" label="Basic date time picker" value={startValue}
                  onChange={(newValue) => setStartValue(newValue)} />
                </Box>
              </LocalizationProvider>
            </Grid>
            <Grid xs={1} sm={6} lg={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box components={["DateTimePicker"]}>
                  <DateTimePicker timezone="America/Los_Angeles" label="Basic date time picker" value={endValue}
                  onChange={(newValue) => {
                    console.log(newValue)
                    setEndValue(newValue)}}/>
                </Box>
              </LocalizationProvider>
            </Grid>
          </Grid>
         

          <Grid container spacing={3}>
          <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Total Orders"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={loading ? <DNA
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                  /> : data != undefined ? data?.order?.orders.length : "loading"}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Marmalade Grove"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={loading ? <DNA
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                  /> : data != undefined ? data?.order?.locationIdCounts[61394944053] : "loading"}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Commerce"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={loading ? <DNA
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                  /> : data != undefined ? data?.order?.locationIdCounts[65769406517] : "loading"}
              />
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Total Order Value"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={loading ? <DNA
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                  /> : data != undefined ? '$' + data?.order?.totalCurrentSubtotal : "loading"}
              />
            </Grid>


          </Grid>


          <Typography variant="h4" sx={{ marginTop: "25px", marginBottom: "25px" }}>
            Marmalade Grove
          </Typography>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(rows) ? rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }) : null}
          </TableBody>
        </Table>
      </TableContainer>
      {Array.isArray(rows) ? 
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> : null }
    </Paper>


    <Typography variant="h4" sx={{ marginTop: "25px", marginBottom: "25px" }}>
            Commerce
          </Typography>
          
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(rows2) ? rows2
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }) : null}
          </TableBody>
        </Table>
      </TableContainer>
      {Array.isArray(rows2) ? 
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows2.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> : null }
    </Paper>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
