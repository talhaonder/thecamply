'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  BookmarkIcon,
  MapPinIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'
import { Menu } from '@headlessui/react'
import { useFeedStore } from '@/shared/stores/feedStore'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import type { Post } from '@/shared/types/post'

interface PostCardProps {
  post: Post
  onComment?: () => void
  onShare?: () => void
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onComment,
  onShare
}) => {
  const { likePost, bookmarkPost } = useFeedStore()
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleLike = () => {
    likePost(post.id)
  }

  const handleBookmark = () => {
    bookmarkPost(post.id)
  }

  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }))
  }

  return (
    <article className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/users/${post.author.username}`}>
              <Avatar
                src={post.author.avatar}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                size="md"
              />
            </Link>
            
            <div>
              <div className="flex items-center space-x-1">
                <Link
                  href={`/users/${post.author.username}`}
                  className="font-semibold text-secondary-900 dark:text-secondary-100 hover:underline"
                >
                  {post.author.firstName} {post.author.lastName}
                </Link>
                {post.author.isVerified && (
                  <CheckBadgeIcon className="h-5 w-5 text-primary-600" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                <Link
                  href={`/users/${post.author.username}`}
                  className="hover:underline"
                >
                  @{post.author.username}
                </Link>
                <span>•</span>
                <time dateTime={post.createdAt}>
                  {formatTimeAgo(post.createdAt)}
                </time>
              </div>
            </div>
          </div>

          <Menu as="div" className="relative">
            <Menu.Button className="rounded-full p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-secondary-800">
              <Menu.Item>
                <button className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700 w-full text-left">
                  Share
                </button>
              </Menu.Item>
              <Menu.Item>
                <button className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700 w-full text-left">
                  Report
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        {/* Location */}
        {post.location && (
          <div className="mt-2 flex items-center text-sm text-secondary-600 dark:text-secondary-400">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {post.location.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-secondary-900 dark:text-secondary-100 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/search?q=%23${tag}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={cn(
          'grid gap-1',
          post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {post.images.map((image, index) => (
            !imageError[image] && (
              <div
                key={index}
                className={cn(
                  'relative aspect-square overflow-hidden',
                  post.images!.length === 3 && index === 0 && 'row-span-2'
                )}
              >
                <Image
                  src={image}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                  onError={() => handleImageError(image)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-secondary-100 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center space-x-2 transition-colors',
                post.isLiked
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-secondary-600 hover:text-red-600 dark:text-secondary-400 dark:hover:text-red-400'
              )}
            >
              {post.isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {formatNumber(post.likes)}
              </span>
            </button>

            <button
              onClick={onComment}
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
            >
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {formatNumber(post.comments)}
              </span>
            </button>

            <button
              onClick={onShare}
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
            >
              <ShareIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {formatNumber(post.shares)}
              </span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={cn(
              'transition-colors',
              post.isBookmarked
                ? 'text-primary-600 hover:text-primary-700'
                : 'text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400'
            )}
          >
            {post.isBookmarked ? (
              <BookmarkIconSolid className="h-5 w-5" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}