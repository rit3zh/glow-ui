//
//  UIHostingController.swift
//  Pods
//
//  Created by rit3zh CX on 5/6/25.
//

import SwiftUI
import ExpoModulesCore

extension ExpoView {
  func setupHostingController(_ hostingController: UIHostingController<some View>) {
    hostingController.view.translatesAutoresizingMaskIntoConstraints = false
    hostingController.view.backgroundColor = .clear
    
    addSubview(hostingController.view)
    NSLayoutConstraint.activate([
      hostingController.view.topAnchor.constraint(equalTo: self.topAnchor),
      hostingController.view.bottomAnchor.constraint(equalTo: self.bottomAnchor),
      hostingController.view.leftAnchor.constraint(equalTo: self.leftAnchor),
      hostingController.view.rightAnchor.constraint(equalTo: self.rightAnchor)
    ])
  }
}
