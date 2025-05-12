//
//  SeekBarExpoView.swift
//  Pods
//
//  Created by rit3zh CX on 5/6/25.
//

import ExpoModulesCore
import SwiftUI

class SeekBarExpoView: ExpoView {
    let props: SeekBarProps
  let onEvent = EventDispatcher()

  required init(appContext: AppContext? = nil) {
      props = SeekBarProps(onEvent: onEvent)
      let hostingController = UIHostingController(rootView: SeekBarView(props: props))
    super.init(appContext: appContext)
    setupHostingController(hostingController)
  }
}
