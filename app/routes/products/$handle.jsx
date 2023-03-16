import { useLoaderData } from '@remix-run/react';
import {json} from 'react-router';
import ProductGallery from '~/components/ProductGallery';
import ProductOptions from '~/components/ProductOptions';

export const loader = async ({params, context, request}) => {
    console.log("loader for ProductHandler")
    const {handle} = params;
    const searchParams = new URL(request.url).searchParams;
    const selectedOptions = [];

    searchParams.forEach((value, name)=>{
        selectedOptions.push({name, value});
        //console.log(selectedOptions)
    })

    const {product} = await context.storefront.query(PRODUCT_QUERY, {
            variables: {
                handle,
                selectedOptions,
            },
        });

    //console.log(JSON.stringify(product, null, 2))
    
    if (!product?.id) {
        throw new Response(null, {status: 404});
    }
  
    return json({
      handle,
      product,
    });
  }

export default function ProductHandle() {
    const {handle, product} = useLoaderData();

    return (
        <section className="w-full gap-4 md:gap-8 grid px-6 md:px-8 lg:px-12">
          <div className="grid items-start gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden md:grid-cols-2 md:w-full lg:col-span-2">
              <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
                {/*<h2>TODO Product Gallery</h2>*/}
                <ProductGallery media={product.media.nodes} />
              </div>
            </div>
            <div className="md:sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem]">
              <div className="grid gap-2">
                <h1 className="text-4xl font-bold leading-10 whitespace-normal">
                  {product.title}
                </h1>
                <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                  {product.vendor}
                </span>
              </div>
              <ProductOptions options={product.options} />
              {/*<p>Selected Variant: {product.selectedVariant?.id}</p>*/}
                <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              ></div>
            </div>
          </div>
        </section>
      );
  }

  function PrintJson({data}) {
    return (
      <details className="outline outline-2 outline-blue-300 p-4 my-2">
        <summary>Product JSON</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    );
  }

const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      media(first: 10) {
        nodes {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            sources {
              mimeType
              url
            }
          }
        }
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
