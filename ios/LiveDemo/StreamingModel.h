//
//  StreamingModel.h
//  LiveDemo
//
//  Created by 白璐 on 16/8/10.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "SettingModel.h"

@class VCSimpleSession;

@interface StreamingModel : SettingModel
@property(nonatomic, strong) VCSimpleSession* session;
@property(nonatomic, assign) BOOL beautyEnabled;
@end
