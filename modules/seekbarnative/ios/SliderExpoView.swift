//
//  SliderExpoView.swift
//  Pods
//
//  Created by rit3zh CX on 5/6/25.
//

import ExpoModulesCore
import SwiftUI

class SliderExpoView: ExpoView {
  let props: SliderProps
  let onEvent = EventDispatcher()
  
  required init(appContext: AppContext? = nil) {
    props = SliderProps(onEvent: onEvent)
    let hostingController = UIHostingController(rootView: SliderView(props: props))
    super.init(appContext: appContext)
    setupHostingController(hostingController)
  }
}
