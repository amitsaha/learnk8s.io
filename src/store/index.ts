import { createStore, combineReducers } from 'redux'
import * as CoursesReducer from './coursesReducer'
import * as WebsiteReducer from './websiteReducer'
import * as ConfigReducer from './configReducer'
import { OnlineCourse } from './coursesReducer'
import { configureStore } from '@reduxjs/toolkit'

export type State = ReturnType<typeof store.getState>

export const Action = {
  ...CoursesReducer.Action,
  ...WebsiteReducer.Action,
  ...ConfigReducer.Action,
}

export type Store = typeof store

export const store = configureStore({
  reducer: {
    ...CoursesReducer.courseReducer,
    ...WebsiteReducer.websiteReducer,
    ...ConfigReducer.configReducer,
  },
  middleware: [...WebsiteReducer.middlewares, ...CoursesReducer.middlewares],
})

export const Selector = {
  ...CoursesReducer.Selector,
  ...WebsiteReducer.Selector,
  ...ConfigReducer.Selector,
}

store.dispatch(
  Action.configs.add({
    id: 'config',
    organisationId: process.env.ENVENTBRITE_ORG as string,
    isProduction: process.env.NODE_ENV === 'production',
    hostname: 'learnk8s.io',
    protocol: 'https',
    eventBriteToken: process.env.ENVENTBRITE_TOKEN as string,
    googleAnalytics: process.env.GOOGLE_ANALYTICS as string,
    outputFolder: '_site',
    canPublishEvents: process.env.PUBLISH_EVENTS === 'yes',
  }),
)

export function getWorkshops(state: State): CoursesReducer.FullWorkshop[] {
  return Object.values(Selector.workshops.selectAll(state)).map(workshop => {
    return {
      price: Object.values(Selector.prices.selectAll(state)).find(it => it.id === workshop.priceId)!,
      venue: Object.values(Selector.venues.selectAll(state)).find(it => it.id === workshop.venueId)!,
      picture: Object.values(Selector.pictures.selectAll(state)).find(it => it.id === workshop.pictureId)!,
      ...Object.values(Selector.courses.selectAll(state)).find(it => it.id === workshop.courseId)!,
      ...workshop,
    }
  })
}

export function getOnlineCourses(state: State): OnlineCourse[] {
  return Object.values(Selector.onlineCourses2.selectAll(state))
}

export function getConfig(state: State): ConfigReducer.Config {
  return Selector.configs.selectAll(store.getState())[0]
}

export function getPages(state: State): WebsiteReducer.Page[] {
  return Object.values(Selector.pages.selectAll(store.getState()))
}

export function getOpenGraph(state: State): WebsiteReducer.OpenGraph[] {
  return Object.values(Selector.openGraphs.selectAll(store.getState()))
}

export function getLandingPageLocations(state: State): WebsiteReducer.LandingPage[] {
  return Object.values(Selector.landings.selectAll(store.getState()))
}

export function getAuthors(state: State): WebsiteReducer.Author[] {
  return Object.values(Selector.authors.selectAll(store.getState()))
}

export function getBlogPosts(state: State): WebsiteReducer.BlogPost[] {
  return Object.values(Selector.blogPosts.selectAll(store.getState()))
}

export function hasTag(state: State, tagId: string) {
  return (page: WebsiteReducer.Page) => {
    return Selector.tags
      .selectAll(store.getState())
      .filter(it => it.pageId === page.id)
      .some(it => it.tag === tagId)
  }
}

export function getBlogPostMarkdownBlocks(state: State): WebsiteReducer.BlogPostMarkdownBlock[] {
  return Object.values(Selector.relatedBlogs.selectAll(store.getState()))
}

export function getRedirects(state: State): WebsiteReducer.Redirect[] {
  return Object.values(Selector.redirects.selectAll(store.getState()))
}

export function getPreviewPictures(state: State): WebsiteReducer.PreviewPicture[] {
  return Object.values(Selector.previewPictures.selectAll(store.getState()))
}
