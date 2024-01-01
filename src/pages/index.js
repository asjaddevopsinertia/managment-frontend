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
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Los_Angeles');

const now = new Date();

const Page = () => {
  const [selectedRange, setSelectedRange] = useState("week");
  const [productData, setProductData] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tranformedData, setTransformedData] = useState([])
  const [tranformedData1, setTransformedData1] = useState([])

  const [endValue, setEndValue] =  useState(dayjs('2024-01-01'))
  const [startValue, setStartValue] = useState(dayjs('2022-04-17'))

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
              productName,
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
              productName,
              quantity,
              grams: totalGrams
            });
          });
          return result;
        }, []);
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
          <Grid container>
            <Grid xs={1} sm={2} lg={3}>
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
            <Grid xs={1} sm={2} lg={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box components={["DateTimePicker"]}>
                  <DateTimePicker timezone="America/Los_Angeles" label="Basic date time picker" value={startValue}
                  onChange={(newValue) => setStartValue(newValue)} />
                </Box>
              </LocalizationProvider>
            </Grid>
            <Grid xs={1} sm={2} lg={3}>
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
          <Typography variant="h4" sx={{ marginTop: "25px", marginBottom: "25px" }}>
            Marmalade Grove
          </Typography>

          <Grid container spacing={3}>
          <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Total Orders"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={data != undefined ? data?.order?.orders.length : "loading"}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Marmalade Grove"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={data != undefined ? data?.order?.locationIdCounts[61394944053] : "loading"}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Commerce"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={data != undefined ? data?.order?.locationIdCounts[65769406517] : "loading"}
              />
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Total Order Value"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={data != undefined ? '$' + data?.order?.totalCurrentSubtotal : "loading"}
              />
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={75.5} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: "100%" }} value="$15k" />
            </Grid>
          </Grid>
          <Typography variant="h4" sx={{ marginTop: "25px", marginBottom: "25px" }}>
            Commerce
          </Typography>

          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                title="Total Fulfilled"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: "100%" }}
                value={data != undefined ? data?.order?.locationIdCounts[65769406517] : "loading"}
              />
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={75.5} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalProfit sx={{ height: "100%" }} value="$15k" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
