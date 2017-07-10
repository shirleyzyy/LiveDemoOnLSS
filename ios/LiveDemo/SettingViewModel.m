//
//  SettingViewModel.m
//  LiveDemo
//
//  Created by 白璐 on 16/8/10.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "SettingViewModel.h"
#import "SettingModel.h"

@interface SettingViewModel ()
@property(nonatomic, strong) SettingModel* model;
@end

@implementation SettingViewModel

- (instancetype)init {
    if (self = [super init]) {
        _model = [[SettingModel alloc] init];
    }
    
    return self;
}

- (NSString*)url {
    return _model.url;
}

- (void)setUrl:(NSString *)url {
    _model.url = url;
}

- (Resolution)resolution {
    return _model.resolution;
}

- (void)setResolution:(Resolution)resolution {
    _model.resolution = resolution;
}

- (Direction)direction {
    return _model.direction;
}

- (void)setDirection:(Direction)direction {
    _model.direction = direction;
}

@end
