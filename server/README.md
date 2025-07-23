# Data Server

A simple Express.js server that serves data for the A/B Testing PoC application.

## Overview

This server provides all the data that was previously stored in JSON files, exposing it through RESTful endpoints with request logging.

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Start the server:

```bash
npm start
```

The server runs on `http://localhost:3001`

## Available Endpoints

### Core Data Endpoints

- `GET /footer` - Returns footer content and navigation links
- `GET /header` - Returns header navigation and branding data
- `GET /global` - Returns global site configuration
- `GET /product` - Returns all products data
- `GET /experiments` - Returns A/B testing experiments configuration

### Dynamic Product Endpoints

- `GET /product/availability?slug=<product-slug>` - Returns pricing and stock information for a product
- `GET /product/recommendations?slug=<product-slug>` - Returns recommended products for a given product

### Utility Endpoints

- `GET /health` - Health check endpoint

## Features

- **Request Logging**: All requests are logged with timestamps
- **CORS Enabled**: Allows cross-origin requests from the Next.js app
- **Simulated Delays**: Availability and recommendations endpoints include realistic API delays
- **Dynamic Data**: Stock levels and timestamps are updated on each request
- **Error Handling**: Proper HTTP status codes and error responses

## Integration

The Next.js application has been updated to fetch data from this server instead of reading static JSON files. The integration includes:

- Updated `lib/cms.ts` to fetch header, footer, and global data
- Updated `app/page.tsx` to fetch products data
- Updated `app/product/[slug]/page.tsx` for product pages
- Updated API routes to proxy requests to the data server
- Updated `middleware.ts` to fetch A/B experiments from the server
- Updated `lib/ab-testing.ts` to use server endpoints for experiments data

## Data Sources

The server reads data from the following JSON files:

- `./data/cms.json` - Header, footer, and site configuration
- `./data/products.json` - Product catalog and recommendations
- `./data/ab-experiments.json` - A/B testing configuration

## Environment Variables

- `PORT` - Server port (default: 3001)
- `DATA_SERVER_URL` - Used by Next.js app to connect to this server (default: http://localhost:3001)
