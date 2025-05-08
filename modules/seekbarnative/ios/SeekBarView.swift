//
//  SeekBarView.swift
//  Pods
//
//  Created by rit3zh CX on 5/6/25.
//

import SwiftUI
import ExpoModulesCore
import SeekBar

struct SeekBarView: View {
  @ObservedObject var props: SeekBarProps

    @State private var value = 0.0
    @State private var isEditing = false
  var body: some View {
      
           SeekBar(
                 value: $value,
                 onEditingChanged: { edited in  withAnimation{
                     isEditing = edited
                 }
                }
           )
           .seekBarDisplay(with: .trackOnly)
           .trackDimensions(
               trackHeight: isEditing ? 40 : 10,
               inactiveTrackCornerRadius: 1000,
               activeTrackCornerRadius: 1000
               
           )
           .onAppear{
               value = props.value
           }.onChange(of: value) { newValue in
               props.onEvent([
                 "onValueChange": newValue
               ])
           }.frame(
            width: props.width , height: props.height
           )
      
           .padding(.horizontal, isEditing ? 12 : 24)
//      }
  }
}
