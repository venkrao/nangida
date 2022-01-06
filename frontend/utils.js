import * as SecureStore from 'expo-secure-store';


async function setValueFor(key, value) {
  console.log(key, value);
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("🔐 Here's your value 🔐 \n" + result);
  } else {
    console.log('No values stored under that key.' + key);
  }
}

export {setValueFor, getValueFor};