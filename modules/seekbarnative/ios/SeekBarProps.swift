//
//  SeekBarProps.swift
//  Pods
//
//  Created by rit3zh CX on 5/6/25.
//

import SwiftUI
import ExpoModulesCore


class SeekBarProps: ObservableObject {
    @Published var value: Double = 0.0
    @Published var bufferedValue: Double = 0.0
 
    
    @Published var width: Double = 100
    @Published var height: Double = 100
    @Published var step: Double? = nil
    @Published var labelText: String?
    @Published var range: [Double] = [-100, 100]
    @Published var modifiers: [[String: Any]] = []
    @Published var onEvent: EventDispatcher
    init(onEvent: EventDispatcher) {
      self.onEvent = onEvent
    }
}
