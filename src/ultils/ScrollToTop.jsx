import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { refreshNotification } from "../redux/rootReducer";
import { BASE_FILE } from "../constants";
import moment from "moment/moment";

export const scrollToTop = () => {
  window.scrollTo(0, 0)
}

export default function ScrollToTop() {

  const path = useLocation().pathname
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  useEffect(() => {
    scrollToTop()
    dispatch(refreshNotification())
    deleteMetaTag()
    deleteProductScriptTag()
    document.title = 'Maxmin - mang giá trị mới tới mọi đồ cũ'
  }, [path, searchParams]);

  return <></>;
}

export function getElementOffset(e) {
  var curtop = 0;
  if (e.offsetParent) {
    do {
      curtop += e.offsetTop;
    } while (e = e.offsetParent);
    console.log('curtop', curtop)
    return curtop;
  }
}

export const META_TAGS = {
  'DESCRIPTION': 'description',
  'KEYWORDS': 'keywords'
}

const meta_name_to_id = {
  'description': 'meta-description',
  'keywords': 'meta-keywords',
}

export const deleteMetaTag = () => {
  const deleteList = ['meta-description', 'meta-keywords']
  deleteList.forEach(id => {
    document.getElementById(id)?.remove()
  });
}

export const addMetaTag = (name, content) => {
  const id = meta_name_to_id[name]
  let new_meta_tag = document.getElementById(id)
  if (!new_meta_tag) {
    new_meta_tag = document.createElement('meta')
    new_meta_tag.id = id
  }
  new_meta_tag.setAttribute('name', name)
  new_meta_tag.setAttribute('content', content)
  document.head.appendChild(new_meta_tag)
  console.log(new_meta_tag)
}

const deleteProductScriptTag = () => {
  document.getElementById('google-rich-results')?.remove()
}

export const addProductScriptTag = (data) => {
  let script = document.getElementById('google-rich-results')
  if (!script) {
    script = document.createElement('script');
    script.id = 'google-rich-results'
  }
  script.setAttribute('type', 'application/ld+json');
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${data.title} - Maxmin`,
    "image": data.images.map((img) => `${BASE_FILE}/${img.thumb_url}`),
    "description": data.short_desc,
    "sku": data._id,
    "brand": {
      "@type": "Brand",
      "name": "Maxmin"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": data.rating || 4,
      "reviewCount": data.review_count || 50
    },
    "offers": {
      "@type": "Offer",
      "url": `https://books.monsters.vn/product/${data.url_key.replace('books/', '')}`,
      "priceCurrency": "VND",
      "price": data.price,
      "priceValidUntil": moment().add(1, 'M').format('YYYY-MM-DD'),
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock"
    }
  }
  console.log(JSON.stringify(structuredData))
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);

}