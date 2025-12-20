/* Registry of image-generator fn--indexed by kind.
   Each fn takes an attribute map and returns an image URL.
*/
const crdrImages = Object.create(null);


/* Function to register a new kind of image generator fn.
   - kind (string): the label used in <crdr-img kind="...">
   - fn (function): receives an attributes object and returns an image URL
*/
function crdrRegisterImage(kind, fn) {
  crdrImages[kind] = fn;
}


/* Implement <crdr-img> custom HTML element. */
class CrdrImgElement extends HTMLElement {

  connectedCallback() {
    this.crdrUpdateImage();
  }

  static get observedAttributes() {
    // These attribute names trigger updates if you change them.
    return ["kind"];
  }

  attributechangedcallback() {
    this.crdrupdateimage();
  }

  crdrUpdateImage() {
    const kind = this.getAttribute("kind");
    if (!kind || !crdrImages[kind]) {
      console.warn(`crdr-img: No generator for kind="${kind}"`);
      return;
    }

    // Gather all attributes into an object for the generator function
    const attrs = {};
    for (const { name, value } of this.attributes) {
      attrs[name] = value;
    }

    // Compute the image source
    let src;
    const entry = crdrImages[kind];
    if (typeof entry === "function") {
      src = entry(attrs);
    } else if (typeof entry === "string") {
      src = entry;
    } else {
      console.warn(`crdr-img: funky generator type for kind="${kind}"`);
      return;
    }

    // Clear any existing content
    this.innerHTML = "";

    // Create and insert <img>
    const img = document.createElement("img");
    img.src = src;

    // Optional: allow width/height attributes on <crdr-img> to pass through
    if (attrs.width)  img.width  = attrs.width;
    if (attrs.height) img.height = attrs.height;

    // Optional: if alt supplied, use it, otherwise generate reasonable one
    img.alt = attrs.alt || `${kind}`;

    this.appendChild(img);
  }
}

// Define the element only once (protect against multiple inclusions)
if (!customElements.get("crdr-img")) {
  customElements.define("crdr-img", CrdrImgElement);
}

// Built-ins (but it can be extended further by similar calls in other JS)
crdrRegisterImage("logo:Web", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAqxJREFUSMftlUtIVFEcxn/3zvgqK181PYhCK+1FVARBEBFEQUQQRZugoBa1kWiRq1zmIsp1bXpAq1pElEbRiyIJM+nhiJo5lVDm4zrqeGfmPr4WOpKMk7b3O5tzv//9f5fznXO/A7MwMpe0jK0sIkgvrbQa+g9VLVS1vkqSEorLkdSnO9o7s+YcXdSoJNlW/3XV6kPPuVibxvBC5dO1l6hBCScsxcL920E1aobvS4efSm7Y+ylLu//R7uepUYP2eVlq/VUOoBo1AfTOd57Ji5/yWxTVxowm6gbHCeOwiUYiAGwkxANsIMRB2mjhEJ/ZbLhTCGg7DX6vzEAxg05ijMuaQ7aT9E2ALNPM821cM5/TxrWp1l+n7t4y/6zkHY6Ujg3Vqik1j+2SdDlSqgd6P1X7HDmqAt3SkJ89wdbo3V/vdOgVaI+k9SnOnKhuIEgdUMYXM5nB5c9UAM+JsjNdIERMYWAh3Rm3KUKxcg2XMKtSVHCimM9cwxXAak06tpOfsAXQki4gRqJNsGADdrQzRc4rNkODncJMAOSXBNYPvZCxoAw33cR9cpULeqzmv9jJJl6V6wdAH1Wd7kEXAdYBnazM6MFyekxPBaylOU2go4N+jgENFEw+rCm0m2yjETiKz+s0D9b4usoZNVACVOrxOF1BoY6Mz5dQQlJHqOS+YU3xBW+xLM0E/ujuDD9T/GxObeyV+SavavSh/cGbB0WlwTW/H4FpB4oKT/LEihceSNTn7s+UBoZ9V74uqF6WKsZ3oRFAWXqpEZ1UNB4ZCv0jEX7mDddLapenH9oBqtFbUIHuSWqTO9zdt2XaULMuJX9Lkhxd0U0164S6JMmzrZd9S2eUi/2rBm4PfXKiKde8+EjrQF3Pof+K9XYzuCxnRXbIz1Zf/JsTWZ2cvQMz4Q88ErNMp4h/aQAAAABJRU5ErkJggg==");
crdrRegisterImage("logo:Email", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAJtJREFUSMftkzsOwjAQBQeEhESLfYFwGTrMTZ0D5QSR6KgfFYqzAduEJoWnW613/HkyNBqwSwutGDqY3pPTb5vuTfNaHL/PSys44+m/Dvf4rFxIinIK+kSQU5RUEKRLJ1JthcCeYy6sEkxjUZ25UqUgqFOU01EyimwK76g8MHBj5AEMwMUGmE8hrk1h+f7LLAqCEkbw92dqNLbBC+8GGwtFsq5BAAAAAElFTkSuQmCC");
crdrRegisterImage("logo:SMS", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAARtJREFUSMdjYBgFww3wME7yfHPtPx7w5tokTx5GnAZM8vxPBJjkidMA/LYjXIGsB8U5//878z/5DuMVen36WLafgeHF2QSXj7/e/YaJ3/zFiMsT////+fH72zS/GuPf335/+/pSi+362v//IyQ3FSGL//+PrIcF1QhmdgYGJiZGRhZOBgYWzpmtmQklxxkYfHsZGBDiqIAFX6zYlOjMTuq7fA6fGib8Efv4HRvjm1tkG7AmU4RndX9a4t+fZBnw/nb13M5tFrlaYrPCyDKgwqM6TFiTgaF9a9vWJ0dxqUJLB8QleeR0gOKCt9eJ0Y5HFcV5gZPS3AgBokxfnv/7++/vBHeyy4UX5yjSzsBwfj5F2hkYdlSNls5DCwAAMRgUHh7ecbYAAAAASUVORK5CYII=");
crdrRegisterImage("logo:Mastodon", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAAAAAAAB/XlpGAAACx0lEQVRIx+2SS0hUURjH//c1MzYmPvCVDJpQtAysFpEWBIWWaYILq424qnY9qAhKkCjovQpK0EVBmZtcWFTIRCIhPRDMB6UzjlOOz2bGuXdm7j1zvhaapd1r06ZV/9U5H+f7ne//Pwf4L8msuBkTkFCPMqjYgsG/I17FKXSAAKHRViIR/CCUrHJe+HVTiRPQUIE7Su0+Z2UiQ4yyD+MPCiemMQE/xjGMDehGhzXNDTdOi96D/eWxj0RERJzC90c2juR3Zz5ee8sBTIFQatXeiZeAMFUf844ejX+iRXGD+eMDWq/qVjvnLg245kHLuuSfSxEtYuBQxnXBAYK45FGWCqSChXVKuZL76li6bgp4AaAiTV0nPGRBlhDTzQNL2b0tVxo3BWg4LHiqHHuIg2XVyJkWmdt0u93cwib0OFMbHJYJLYjLmiOxrLLkdQz9RiL0x29ik1IFc0A76uKCz7pzMXvFtsZhDrgLQB0k02YeCTfNN+hDgCCIsmIOAKKIDnHV9PZ5aQYqG/vxFqYhpsAL3ZM3Ja3/HSDlO28TBzeDL00QRQCByYTXKgNBFGQAIG7xCkAr9kb4u2WjG5G3nC2rMCMWM7cAFEHDzD2eYdupuEQ7APBw4GJ2hX2X4hLTFp3HjbAISxFUnJT7ir9UBxujbawrcrnXAeF53ufSYCP7SkSU8AeKZ60BdSC0YRgMhGfSG0eT6E4ZPzB9wV9OmDvDiUjv82WPYVU5AQAt6EcHcoTZc0zVp4LnCd5SFibS2q8o15CkJhHIMvqY5qtqtUUxusMIcZo9u/KrydaAODjnumLPKq9NU+M51XIa+xbqllCFJ8lNcBMQQjc4EXFKMCIiraPL+Rr1yVrowTQGikLNuodHuMajsfferRGstCBYAwrhhY5mZb8rIy9mk8jw5XqOYzuOJDsBUAPCU/hgwICBOZThUfLN/0zfAXjdQATnbSAiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA5LTIzVDAyOjM1OjA0KzAwOjAwj3oUxwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wOS0yM1QwMjozMzozMiswMDowMB5m7uUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDktMjNUMDM6MDc6NDErMDA6MDA/wcNAAAAAAElFTkSuQmCC");
crdrRegisterImage("logo:Facebook", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAIAAAAAC+n3VCAAABmElEQVRIx+2UO0tjQRiGnznmslnReMENm0JBEGy00MI/oI2Fnfsj9i8sC9spy3YKop2VYidiIWyhRYpttlG8BS9LDJ5EE2MOJJ6cy2dxJIUkYYLd4tvN8M4z7/sNDLyrheYQUlxgkiNHGlht4Ao1O77PDlCMfRqUXkCJyVUbt4/yDeFy0tqq3Tglp+RY979gXT/BDF85Hx5ai07UjR9A9AEZkuRnIy/HvSrKrTV2NgFMolR5XAFQ2bWWfMfKwpMeYJMzpvmOxACE8nZiL4cCDD2Aj68+fj7sNXqCdUfydCQSsh4wXb0XOGA5VFixTa8iIiLilOyMfXv3Q1jSSxAlTKQ/kqhb4sShy4C/DQCNagGo1xtiwW+9BE842Nfh41CyowdE3H/+oy/F0zhjZHRmsMUiR91/EtaGiIhbufly0pceSEXP6deroFAUylN5qQbZvYdEkTvDhoJehXlgIeAEQBVlpGlegzfqHdASoNSLQ7UCNPkPPKBWdEw8t+rYbvuAPPjpn52r4Ml99rF9gAIM0zCDDm8e1H+uZ/h7mNky/S5AAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA5LTIzVDAyOjM1OjExKzAwOjAwEeg7/gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wOS0yM1QwMjozMzozMiswMDowMB5m7uUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDktMjNUMDM6MDc6NDErMDA6MDA/wcNAAAAAAElFTkSuQmCC");
crdrRegisterImage("logo:Instagram", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAQAAAAAAnrQIPAAAC2klEQVRIx+2T20sUYRjGf9/MuOuua2Kh21HtQHRQKikwwlAjiSIKgozuqougw1UHukjqIoJKKCKCiqQgcKmgmw50gLaig0VUpK1WhB3UFFl1XXdmDzNfNybr7qz0B/TM1cz3Pr/3m+d7P/gvkfwyjWbuUE0u0rbU4gdHKaPBHrCXs/RRIFrz8hz23SwC4drIWwopSgcsoBVon1W4M6dKm2APkFb0e8j38UaJDnNTF8/QxdeZEb8lx1dCDx6+rD5Lpx9CEqzPbNfvGVviW4a3RdvjPd8W9TJpxKf8BZRy3KktEWSSEXD6DF+DL96tFDoWFIzGPArIJl/gILMEdDJVgEDxgDryWRsNKINPjuSsTG4rd1DpUVIC1hhHsS+RR2afs8y1Ss31bJxTi0CoKUMyBiCAaIc0UB3TFZd+v3v/7FYpG7PX1+Wf0LzmkNkPmOrEZI8ypqWwgj+3va9p3xrvNHuD9VNbTsodlBgFV/VLkpDv1apX1QOXpMgMgITaWdRdSNZk4+WjD08YpAlJkPBtK5xT1PK7qovgWEMqQCBcSCeaGb5uBulA5ydR4rqMKe5ZaurtSQcAw0S6zR5X+ekpFVzjCi+YQu4ydaLeti6aXm0DiNL4Q3+ozffuaXZDHRf5XOreZQ2H7todtc0xujiS6D3vWpm7b13R71uyX1tYvMNRFrnwyd9Jxb8AoJ6T775v957IqcupwyRLhobOfD1WauSNt4PkbJZzigPP2zbl12SVC4/5K/b0TfPS2DQeUJs2sqMAiwQgFVMz2EwlDfh7vE00CSFliCxmUM1jLIQTZNxm9E+DGDhnWn0HjzokmZ4PJZEniXBH1RBlqTuXmPRWFlxXJkTuxn5he6+F6q5wLNVvBrZnD61gcOziPG6xWnRt0F9bMSujEv2DjYHigaQfSOr0jBBrafEWLxRuu/4SVUZ6/C1rDA81PLYruchuAsTInEE/fiSL+a9k/QFrhIF6QCGDyAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0yM1QwMjozNToyMCswMDowMDkQN6kAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMjNUMDI6MzM6MzIrMDA6MDAeZu7lAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA5LTIzVDAzOjA3OjQxKzAwOjAwP8HDQAAAAABJRU5ErkJggg==");
crdrRegisterImage("logo:Pinterest", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAYAAAAADmbC0LAAAC7ElEQVRIx+2SS2xUVRjHf3fmDkxHSZkG5BFjQdRQJaZJu9IYTHylJm4wcYmamNgmLIigkCgbayAgISw0NeDGxk0NATeSYIxNKSEIlE7DtJhOh0fp7XR62952nJnOnXvO+VyZ8JgHC1fG/1mdk+/3O985+eC/mij7gH6yTDDJTfYyyROPjp/mCBMI3eHpxtSaO03XG4RZTvMHG+rDbWQYRhhunv2o8KMa0mM6WfrVOzDeuiOUQvNhbXwTGdKcjc3vKo1qUb5/u5j0b+mSkbLjfXU5PkWO1trNJxl83DuqA5XP9zodic0X1ic2O28X+rRvJHdisPEGfdXx1/gWWPjUaDU388HRSJ5FrjFGkb7YfLdRWnufCd9VF3zPFH+2+Gmj3U+EXjv9yt13h9ZOk2Wc4bWlSyKl69eeTFYXHEfw9hjxR8Y2CAudwbwKFo4Q6qYLYemgiCrcebNwHxO6d5NgZyjWbqEutWQGmqLv201he8XWLyON9ABFRwhFG9bFqgvCbApZUUE5sCoeXg9QTh3wxwBYuQpERFFdENCtzaKFvRFKfxkPjF+8AD2cwrJWPmthlouzueqCHxDJ/W7MijduvvCbp6bAODrh8A3bGF0TaQMzm7uVuU9g37sZBfJnY780vBN7qS1jbwSd7Hc0J9jF9Kuh50BdHpmK15pDQTO+ZfFwqjXVHsyL+AMXV+cQUs+XrooErvN6wN1ak9iF4CIIc53GiOjy0klnR7Zr+YqI9r0v3gufoZOaeYZDnOFQuNAr4t9Y+lkHSmsxUp50d1+MJTn/QL39oGCCr+lnSzzyIqjBxP6WDrsNS6eXB55KpiRKB4+QGVLtZddod6fwz5rjJ67S/FCt/TC+lXWUnw7HleNeKfAx27EYYhs9ZCtcVkHQBNirCfvnz6WbGeEcAKeqdFtBYAALNZM/2VkOMVPnuRUELoqiax17a/Bz0nX/y6p0mCQbjwTx/ALb6woqdNBIAzEvymO8XBf/P/9K/gYu9W38NoMYIwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0yM1QwMjozNTozMiswMDowMGIlJh4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMjNUMDI6MzM6MzIrMDA6MDAeZu7lAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA5LTIzVDAzOjA3OjQxKzAwOjAwP8HDQAAAAABJRU5ErkJggg==");
crdrRegisterImage("logo:YouTube", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAgAAAAADOuOrUAAACJUlEQVRIx+2UO08UURiGnzOXndkbKO4G0GiHxFhZUBALY6Kll8rEmFDaaIwl/4BY8AMosLCgJzZaSGJDQTQaLUi8QIIIJO6KMrOzO7dzLFh2Z3ZHpdOC9zRzvvOe5/u+c2YGjvTvJZITC58qJcqMUKFMsR1v4FBjBweHGhZ+NushihW22CVAZYyAXbZYQfEgq4JTbAIvB0fP5k/kS7mCsJUu9f01LRaxbIVe023Wtz9c+gmn2ezN/5waa2POYliPvDiQUvVIyjiIvLDuLH4e+8az/gYeA86sOoScWZjv7DMOHs6xNKBPHObc9YmlgfzewUzrkuyiGEoa4+/BWubFHbcLnbxdgIVd0IpJY7T68dbeo2CjF6AVc4VcP8DEsMilnOrd6uD0l5vufFRLxa2clQEQCCFEOldJe0L+zejdjangU6KFlNHgj7rIU/P9ZHXKGP2dowNQKKlUak1+Fecv3Lln3zAqqc6kShg7gIDIT7/k2vDtmcI180xvTuX7LZkFCD3pJo3m+OB4VtHKDb1Emi6g4coah5Csuw2/H/CaK65cVn/drpDLV91X/S1U2MadGx6xL+vHlCF0dDQh2l+rVJJYxSKOndaLnbky3VPtXGgJB5cFa/KkPSTyum1apmm08XEchYEftVQz/PF283qrRIlGbwUu09yn6ufWy+saRnvs54gJCYmQeAzRYqazveeXBnkUFjYWJgZmO7oP8GkSIPA40v+mX3EvCaIJaAESAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA5LTIzVDAyOjM1OjM5KzAwOjAwYCJy5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wOS0yM1QwMjozMzozMiswMDowMB5m7uUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDktMjNUMDM6MDc6NDErMDA6MDA/wcNAAAAAAElFTkSuQmCC");
crdrRegisterImage("logo:LinkedIn", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAoAAAAAAPecXQAAACWElEQVRIx+2UO2hTURjHf+fetE1SbGttwdShVHwMYjedbAUfXdRBsYNCERcnB3FpQRednBQF3QTFoQhd2qFUtINYEayDtiDakiI29EGCSZObm/bm3PM59JE+MdFBB//D4XwffD++1znwt6VWG2FcDqAIMfw7rMcIMQRhDOF66RkI8LmxulW8xGBzwlqb3K8VYpyPu7KDvu/nne6Rmi+lFhBCmGr3tYiIcVOtXpFx1uoCjCMegJk3OV0kIFC4fiA7VP0k2C7aefj6U32pTazgOwtMher3S358bG9+gRF2YgE5HtDPI/ahGeYme4huBiijk4SaVr0GOqxtgmSpshXgy1XTRAVn7ZfimDneU8PhjYAQLtGWuisKED13Nzg6XdN4w2pAZd8OPD1ztKJFImg7ln717N0xDYfW1xJGmL1sRETE6GSbSzSioyIimReJ+9qRJeXj8Wu37YGNzQgjzF4yRkTEzCdPukQj+quIiO8aLauUj8eOpLi1cQpbTjpkHKff+xY8GD6uyiFQV3sqNDS5fg+2ltGpO/c6dnS+uZjtWfT4TV2B08UDdGzy+XlP0Zbye8UHUNtPlDcUD/ATmaTDbpJ4MyYHoGx7ZXpFADCIYoIsTs4sPRGhFADLQbKJtwTA5vrXAMv/WAClAGwKJ4BSS57Cd7dmEzMTwW4UoNMzHplcps9uQOXGXU8DLv6PdE9ZJZY7mtXLiBVUmHM4Vpm1mIj4ShwqAyAg876ijwugjG1QiKR9xcDaDFyaiZtKs2gtECBFrVaAZgYbiGCkSltAnknK/7R5/1XQT1DCIUqeWFwoAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA5LTIzVDAyOjM1OjUwKzAwOjAwM9U+sAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wOS0yM1QwMjozMzozMiswMDowMB5m7uUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDktMjNUMDM6MDc6NDErMDA6MDA/wcNAAAAAAElFTkSuQmCC");
crdrRegisterImage("logo:BlueSky", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+kJFwMHKTL0XU8AAAAQY2FOdgAAAOAAAAAgAAAAwAAAAACWS7KdAAAB50lEQVRIx+2Uv0scQRiG37sc+OuabBXRJhfhUggBK02wOcEyQf+GBIsrtbSzEaxsLGxT2NiYlPZ2glolQjgSWIgkbPa4A0/l9klxe7M7M6vYJ2+zzPt977Mzsx8r/Vdp8KDI9FTUVTKFsl7qqb7pZzHEhJ/phf7oi5JcD0I0aNHhjHUChPO2gUPAOmd0aNGwOhBim4H6HFG3EWm8zhH9tGvbB+yS6YTZDJHGZznJdewOq2VD6eZ2vKA91YZhSVJNe1rIdZjuDBBbh17UjgKzCrSjRaseW4CSJEVKrJYVbagiSapoQytWLVHkfCfEO26x1WYVIVZpO5Vb3tpfSYg3dHB1yjTTnHp+h9dDQMUwfilW1ZmeOTUlzXkjGeu3N2eM8xlfMXGB+4lx/whiiZDHKGTJndThsCxzTESPu8LgHT0ijln2Rz1DVGmwz3czspn6/GCfBtXCuEHMcEBMUriDhJgDZu6JS4gJDr2QCztkIg8oW4xJzTvUC104zrwm88uKVWzrSlOW81HSK8u5Urv4BIM7WKOX2+4lNWpc5pweaw/dgRhli+u0+YYmQjS5SZ1rthi9F5AiRvjAOV1CNhlDiDE2CelyzntGeOgHbEpTeq5IX9VP109UV6CWQj9U8nfh8h/3y/+X9RdNh0j9YgDwyQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0yM1QwMjozNjowNiswMDowMPPSvu0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMjNUMDI6MzM6MzIrMDA6MDAeZu7lAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA5LTIzVDAzOjA3OjQxKzAwOjAwP8HDQAAAAABJRU5ErkJggg==");
crdrRegisterImage("logo:User", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQFJREFUSMdjYBgFFANmfJJMDE58ZoLPvv4gz+wa40eH/v39///To5WpHIwka2+1+f3tPxwcaCNRuwTTu1v/kcC/v9XGJBnQZPkfDRzuxhVOWIGwCLoIvyRJBnz8gC7y5Q1JXlBj/fQI1QutNiQG42Svv78Q2k/PIDkexZiO9sG0v7rkKUii9lLd52eQPfD97dIEErR3O/368h8DHOpiIU57luqP9/+xgjWZRGhnYri36z8O8OtLtDRBA+rN/uMBh7oIGnCkF58BHx8QNODRof94QZgEgaTMJYLfAlW0UMCImV3dRn5MLP/+/Pn59/ffX//+IssxMv3+fuL2aDE+CjABAGmgNI7ncv1dAAAAAElFTkSuQmCC");

const crdrQuickLinksData = [
    { icon: "Web", url: "https://www.crdrlabs.org/", label: "www.crdrlabs.org" },
    { icon: "Email", url: "mailto:crdrlabs@neniam.net", label: "crdrlabs@neniam.net"},
    { icon: "SMS", url: "sms:+14256107056", label: "425-610-7056"},
    { icon: "Mastodon", url: "https://hachyderm.io/@crdrlabs", },
    { icon: "Facebook", url: "https://www.facebook.com/profile.php?id=61581111038860", },
    { icon: "Instagram", url: "https://www.instagram.com/crdrlabs/#", },
    { icon: "Pinterest", url: "https://www.pinterest.com/crdrlabs", },
    { icon: "YouTube", url: "https://www.youtube.com/channel/UCNPX5YtjukWeVPAQpmj2czQ/", },
    { icon: "LinkedIn", url: "https://www.linkedin.com/company/crdrlabs", },
    { icon: "BlueSky", url: "https://bsky.app/profile/crdrlabs.org", },
];


/* Implement <crdr-quicklinks> custom HTML element. */
class CrdrQuicklinksElement extends HTMLElement {

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    // These attribute names trigger updates if you change them.
    return ["kind"];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const classpass = this.getAttribute("classpass");
    const uselabel = this.hasAttribute("uselabel");
    this.innerHTML = "";
    crdrQuickLinksData.forEach(link => {
      const a = document.createElement("a");
      a.href = link.url;
      let icon = link.icon;
      let label = link.label || icon;
      a.className = classpass;
      if (uselabel) {
        a.textContent = " "+label;
      }

      const iconEl = document.createElement("crdr-img");
      iconEl.setAttribute("kind", `logo:${icon}`);
      iconEl.setAttribute("alt", icon);
      a.prepend(iconEl);
      this.appendChild(a);
    });
  }
}

// Define the element only once (protect against multiple inclusions)
if (!customElements.get("crdr-quicklinks")) {
  customElements.define("crdr-quicklinks", CrdrQuicklinksElement);
}
