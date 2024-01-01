import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

const now = new Date();

const Page = () => {

  const [selectedRange, setSelectedRange] = useState('week');
  const [productData, setProductData] = useState([])
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let token = window.localStorage.getItem('token');
        const response = await axios.post(
          'https://management.marmaladegrove.com/orders/time-range',
          {
            range: selectedRange,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("re", response.data)
        setData(response.data)
        setProductData(Object.keys(response.data.order.productDetails))
        setLoading(false)
        // Do something with the response data here
      } catch (error) {
        console.error('Error:', error);
        setLoading(false)
        // Handle errors here
      }
    };

    fetchData();
  }, [selectedRange]);

  const handleChange = (event) => {
    setSelectedRange(event.target.value);
  };

  console.log("data",data?.order)
  

  return (
    <>
      <Head>
        <title>
          Overview | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >


        <Container maxWidth="xl">

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


          <Typography variant="h4" sx={{ marginTop: '25px', marginBottom: '25px' }}>
            Marmalade Grove
          </Typography>


          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >

              <OverviewBudget
                title="Total Orders Fulfilled"
                subTitle={selectedRange}
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={data != undefined ? data?.order?.locationIdCounts[61394944053] : 'loading'}
              />
            </Grid>

            {Array.isArray(productData) && Array.length > 0 ? productData.map(productId => {
              console.log("product", productId)
        const product = data.order.productDetails[61394944053];
        return Object.keys(product).map(productName => {
          console.log("productname", productName)
          const { quantity, totalGrams } = product[productName];
          return (
            <Grid key={productName} item xs={12} sm={6} lg={3}>
              <OverviewBudget
                title={productName}
                subTitle="Product"
                difference={12} // Replace with the appropriate difference value
                positive
                sx={{ height: '100%' }}
                value={`Quantity: ${quantity}, Grams: ${totalGrams}`}
              />
            </Grid>
          );
        });
      }): 'error'}
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: '100%' }}
                value="1.6k"
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTasksProgress
                sx={{ height: '100%' }}
                value={75.5}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTotalProfit
                sx={{ height: '100%' }}
                value="$15k"
              />
            </Grid>
        </Grid>
            <Typography variant="h4" sx={{ marginTop: '25px', marginBottom: '25px' }}>
              Commerce
            </Typography>


            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >

                <OverviewBudget
                  title="Total Fulfilled"
                  subTitle={selectedRange}
                  difference={12}
                  positive
                  sx={{ height: '100%' }}
                  value={data != undefined ? data?.order?.locationIdCounts[65769406517] : 'loading'}
                />
              </Grid>

              
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewTotalCustomers
                  difference={16}
                  positive={false}
                  sx={{ height: '100%' }}
                  value="1.6k"
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewTasksProgress
                  sx={{ height: '100%' }}
                  value={75.5}
                />
              </Grid>
              <Grid
                xs={12}
                sm={6}
                lg={3}
              >
                <OverviewTotalProfit
                  sx={{ height: '100%' }}
                  value="$15k"
                />
              </Grid>
            </Grid>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
