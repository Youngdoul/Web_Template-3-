import { useMemo } from 'react';
import { filter } from 'lodash-es';
import { Chance } from 'chance';

import useSWR, { mutate } from 'swr';

const chance = new Chance();
const LOCAL_STORAGE = 'mantis-ts-cart';

const endpoints = {
  key: 'cart'
};

const initialState = {
  step: 0,
  products: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  payment: {
    type: 'free',
    method: 'card',
    card: ''
  }
};

export function useGetCart() {
  const localProducts = localStorage.getItem(LOCAL_STORAGE);

  // to update local state based on key
  const { data, isLoading } = useSWR(endpoints.key, () => (localProducts ? JSON.parse(localProducts) : initialState), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess(data) {
      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(data));
    }
  });

  const memoizedValue = useMemo(() => ({ cart: data, cartLoading: isLoading }), [data, isLoading]);

  return memoizedValue;
}

export function addToCart(product, products) {
  // to update local state based on key
  let subtotal = 0;
  let latestProducts;

  const newProduct = { ...product, itemId: chance.timestamp() };
  subtotal = newProduct.quantity * newProduct.offerPrice;

  const inCartProduct = filter(products, {
    id: newProduct.id,
    color: newProduct.color,
    size: newProduct.size
  });
  if (inCartProduct && inCartProduct.length > 0) {
    const newProducts = products.map((item) => {
      if (newProduct.id === item.id && newProduct.color === item.color && newProduct.size === item.size) {
        return { ...newProduct, quantity: newProduct.quantity + inCartProduct[0].quantity };
      }
      return item;
    });
    latestProducts = newProducts;
  } else {
    latestProducts = [...products, newProduct];
  }

  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        products: latestProducts,
        subtotal: currentCart.subtotal + subtotal,
        total: currentCart.total + subtotal
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function updateCartProduct(id, quantity, products) {
  // to update local state based on key
  let subtotal = 0;
  let oldSubTotal = 0;

  const newProduct = filter(products, { itemId: id })[0];

  subtotal = quantity * newProduct.offerPrice;
  oldSubTotal = 0;

  const latestProducts = products.map((item) => {
    if (id === item.itemId) {
      oldSubTotal = item.quantity * (item.offerPrice || 0);
      return { ...item, quantity };
    }
    return item;
  });

  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        products: latestProducts,
        subtotal: currentCart.subtotal - oldSubTotal + subtotal,
        total: currentCart.total - oldSubTotal + subtotal
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function removeCartProduct(id, products) {
  // to update local state based on key
  let subtotal = 0;

  const newProduct = filter(products, { itemId: id })[0];

  subtotal = newProduct.quantity * newProduct.offerPrice;
  const latestProducts = filter(products, (item) => item.itemId !== id);

  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        products: latestProducts,
        subtotal: currentCart.subtotal - subtotal,
        total: currentCart.total - subtotal
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setCheckoutStep(step) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        step
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setNextStep() {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        step: currentCart.step + 1
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setBackStep() {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        step: currentCart.step - 1
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setBillingAddress(billing) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = {
        ...currentCart,
        billing
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setCartDiscount(code, total) {
  // to update local state based on key
  let amount = 0;
  if (total > 0) {
    switch (code) {
      case 'BERRY50':
        amount = chance.integer({ min: 1, max: total < 49 ? total : 49 });
        break;
      case 'FLAT05':
        amount = total < 5 ? total : 5;
        break;
      case 'SUB150':
        amount = total < 150 ? total : 150;
        break;
      case 'UPTO200':
        amount = chance.integer({ min: 1, max: total < 199 ? total : 199 });
        break;
      default:
        amount = 0;
    }
  }

  let difference = 0;

  mutate(
    endpoints.key,
    (currentCart) => {
      if (currentCart.discount > 0) {
        difference = currentCart.discount;
      }

      const newCart = {
        ...currentCart,
        discount: amount,
        total: currentCart.total + difference - amount
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setPaymentMethod(method) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = { ...currentCart, payment: { ...currentCart.payment, method } };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setPaymentCard(card) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart) => {
      const newCart = { ...currentCart, payment: { ...currentCart.payment, card } };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function resetCart() {
  // to update local state based on key
  mutate(
    endpoints.key,
    () => {
      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(initialState));
      return initialState;
    },
    false
  );
}
