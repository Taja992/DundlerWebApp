/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateCustomerDto {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface CreateOrderDto {
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string | null;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
}

export interface CreateOrderEntryDto {
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  productId?: number | null;
  /** @format int32 */
  orderId?: number | null;
}

export interface CreateOrderWithEntriesDto {
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string | null;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
  orderEntries?: CreateOrderEntryDto[] | null;
}

export interface CreatePaperDto {
  name?: string | null;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
}

export interface CreatePropertyDto {
  propertyName?: string | null;
}

export interface Customer {
  /** @format int32 */
  id?: number;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  orders?: Order[] | null;
}

export interface CustomerDto {
  /** @format int32 */
  id?: number;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  orders?: OrderDto[] | null;
}

export interface Order {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string | null;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
  customer?: Customer;
  orderEntries?: OrderEntry[] | null;
}

export interface OrderDto {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string | null;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
  customer?: CustomerDto;
  orderEntries?: OrderEntryDto[] | null;
}

export interface OrderEntry {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  productId?: number | null;
  /** @format int32 */
  orderId?: number | null;
  order?: Order;
  product?: Paper;
}

export interface OrderEntryDto {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  productId?: number | null;
  /** @format int32 */
  orderId?: number | null;
  order?: OrderDto;
  product?: PaperDto;
}

export interface Paper {
  /** @format int32 */
  id?: number;
  name?: string | null;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
  orderEntries?: OrderEntry[] | null;
  properties?: Property[] | null;
}

export interface PaperDto {
  /** @format int32 */
  id?: number;
  name?: string | null;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
  orderEntries?: OrderEntryDto[] | null;
  properties?: PropertyDto[] | null;
}

export interface Property {
  /** @format int32 */
  id?: number;
  propertyName?: string | null;
  papers?: Paper[] | null;
}

export interface PropertyDto {
  /** @format int32 */
  id?: number;
  propertyName?: string | null;
  papers?: PaperDto[] | null;
}

export interface UpdateCustomerDto {
  /** @format int32 */
  id?: number;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface UpdateOrderDto {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string | null;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
}

export interface UpdatePaperDto {
  /** @format int32 */
  id?: number;
  name?: string | null;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
  propertyIds?: number[] | null;
}

export interface UpdatePropertyDto {
  /** @format int32 */
  id?: number;
  propertyName?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  customers = {
    /**
     * No description
     *
     * @tags Customers
     * @name CustomersCreate
     * @request POST:/Customers
     */
    customersCreate: (data: CreateCustomerDto, params: RequestParams = {}) =>
      this.request<CustomerDto, any>({
        path: `/Customers`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name CustomersList
     * @request GET:/Customers
     */
    customersList: (params: RequestParams = {}) =>
      this.request<CustomerDto[], any>({
        path: `/Customers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name OrdersCreate
     * @request POST:/Customers/{customerId}/orders
     */
    ordersCreate: (customerId: number, data: OrderDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Customers/${customerId}/orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name CustomersDetail
     * @request GET:/Customers/{id}
     */
    customersDetail: (id: number, params: RequestParams = {}) =>
      this.request<CustomerDto, any>({
        path: `/Customers/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name CustomersUpdate
     * @request PUT:/Customers/{id}
     */
    customersUpdate: (id: number, data: UpdateCustomerDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Customers/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name CustomersDelete
     * @request DELETE:/Customers/{id}
     */
    customersDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Customers/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customers
     * @name CustomerOrdersList
     * @request GET:/Customers/customer-orders
     */
    customerOrdersList: (params: RequestParams = {}) =>
      this.request<CustomerDto[], any>({
        path: `/Customers/customer-orders`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  orderEntries = {
    /**
     * No description
     *
     * @tags OrderEntries
     * @name OrderEntriesCreate
     * @request POST:/OrderEntries
     */
    orderEntriesCreate: (data: OrderEntry, params: RequestParams = {}) =>
      this.request<OrderEntry, any>({
        path: `/OrderEntries`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntries
     * @name OrderEntriesList
     * @request GET:/OrderEntries
     */
    orderEntriesList: (params: RequestParams = {}) =>
      this.request<OrderEntry[], any>({
        path: `/OrderEntries`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntries
     * @name OrderEntriesDetail
     * @request GET:/OrderEntries/{id}
     */
    orderEntriesDetail: (id: number, params: RequestParams = {}) =>
      this.request<OrderEntry, any>({
        path: `/OrderEntries/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntries
     * @name OrderEntriesUpdate
     * @request PUT:/OrderEntries/{id}
     */
    orderEntriesUpdate: (id: number, data: OrderEntry, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/OrderEntries/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntries
     * @name OrderEntriesDelete
     * @request DELETE:/OrderEntries/{id}
     */
    orderEntriesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/OrderEntries/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntries
     * @name OrderDetail
     * @request GET:/OrderEntries/order/{orderId}
     */
    orderDetail: (orderId: number, params: RequestParams = {}) =>
      this.request<OrderEntry[], any>({
        path: `/OrderEntries/order/${orderId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntries
     * @name ProductDetail
     * @request GET:/OrderEntries/product/{productId}
     */
    productDetail: (productId: number, params: RequestParams = {}) =>
      this.request<OrderEntry[], any>({
        path: `/OrderEntries/product/${productId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  orders = {
    /**
     * No description
     *
     * @tags Orders
     * @name OrdersCreate
     * @request POST:/Orders
     */
    ordersCreate: (data: CreateOrderDto, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/Orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersList
     * @request GET:/Orders
     */
    ordersList: (params: RequestParams = {}) =>
      this.request<OrderDto[], any>({
        path: `/Orders`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersDetail
     * @request GET:/Orders/{id}
     */
    ordersDetail: (id: number, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/Orders/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersUpdate
     * @request PUT:/Orders/{id}
     */
    ordersUpdate: (id: number, data: UpdateOrderDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Orders/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersDelete
     * @request DELETE:/Orders/{id}
     */
    ordersDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Orders/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name CustomerDetail
     * @request GET:/Orders/Customer/{customerId}
     */
    customerDetail: (customerId: number, params: RequestParams = {}) =>
      this.request<OrderDto[], any>({
        path: `/Orders/Customer/${customerId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name CreateWithEntriesCreate
     * @request POST:/Orders/CreateWithEntries
     */
    createWithEntriesCreate: (data: CreateOrderWithEntriesDto, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/Orders/CreateWithEntries`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  paper = {
    /**
     * No description
     *
     * @tags Paper
     * @name PaperCreate
     * @request POST:/Paper
     */
    paperCreate: (data: CreatePaperDto, params: RequestParams = {}) =>
      this.request<PaperDto, any>({
        path: `/Paper`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperList
     * @request GET:/Paper
     */
    paperList: (params: RequestParams = {}) =>
      this.request<PaperDto[], any>({
        path: `/Paper`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDetail
     * @request GET:/Paper/{id}
     */
    paperDetail: (id: number, params: RequestParams = {}) =>
      this.request<PaperDto, any>({
        path: `/Paper/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperUpdate
     * @request PUT:/Paper/{id}
     */
    paperUpdate: (id: number, data: UpdatePaperDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Paper/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDelete
     * @request DELETE:/Paper/{id}
     */
    paperDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Paper/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PropertyDetail
     * @request GET:/Paper/property/{propertyId}
     */
    propertyDetail: (propertyId: number, params: RequestParams = {}) =>
      this.request<PaperDto[], any>({
        path: `/Paper/property/${propertyId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  properties = {
    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesCreate
     * @request POST:/Properties
     */
    propertiesCreate: (data: CreatePropertyDto, params: RequestParams = {}) =>
      this.request<PropertyDto, any>({
        path: `/Properties`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesList
     * @request GET:/Properties
     */
    propertiesList: (params: RequestParams = {}) =>
      this.request<PropertyDto[], any>({
        path: `/Properties`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesDetail
     * @request GET:/Properties/{id}
     */
    propertiesDetail: (id: number, params: RequestParams = {}) =>
      this.request<PropertyDto, any>({
        path: `/Properties/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesUpdate
     * @request PUT:/Properties/{id}
     */
    propertiesUpdate: (id: number, data: UpdatePropertyDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Properties/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesDelete
     * @request DELETE:/Properties/{id}
     */
    propertiesDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Properties/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
}
