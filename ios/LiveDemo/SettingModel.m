//
//  SettingModel.m
//  LiveDemo
//
//  Created by 白璐 on 16/8/10.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "SettingModel.h"

@implementation SettingModel

- (instancetype)init {
    if (self = [super init]) {
        _url = @"";
        _resolution = Resolution_720P;
        _direction = DirectionPortrait;
    }
    
    return self;
}

@end
