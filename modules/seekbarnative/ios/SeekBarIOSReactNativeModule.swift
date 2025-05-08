//
//  SeekBarModule.swift
//  Pods
//
//  Created by rit3zh CX on 5/6/25.
//

import ExpoModulesCore



public class SeekBarIOSReactNativeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SeekBarIOSReactNative")
      
      View(SeekBarExpoView.self) {
          Events("onEvent")
          Prop("value") { (view: SeekBarExpoView, prop: Double) in
              view.props.value = prop
          }
          
          Prop("width") { (view: SeekBarExpoView, prop: Double) in
              view.props.width = prop
          }
          Prop("height") { (view: SeekBarExpoView, prop: Double) in
              view.props.height = prop
          }
          Prop("range") { (view: SeekBarExpoView, prop: [Double]) in
              view.props.range = prop
          }
          Prop("step") { (view: SeekBarExpoView, prop: Double) in
              view.props.step = prop
          }
          Prop("label") { (view: SeekBarExpoView, prop: String?) in
              view.props.labelText = prop
          }
          Prop("modifiers") { (view: SeekBarExpoView, prop: [[String: Any]]) in
              view.props.modifiers = prop
          }
      }
  }
}
